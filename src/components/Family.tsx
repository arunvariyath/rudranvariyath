import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Briefcase,
  ChevronDown,
  Heart,
  Network,
  LayoutGrid,
  Link2,
  CornerDownRight,
} from 'lucide-react';
import {
  people,
  coreGenerations,
  branches,
  familyTree,
  branchToTree,
  familyPhotoUrl,
  POET_FALLBACK_PHOTO,
  type Unit,
  type SiblingUnit,
  type Branch,
  type TreeNode,
} from '../data/family';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { useLanguage } from '../i18n/LanguageProvider';
import { Avatar } from './Avatar';
import { cn } from '../utils/cn';

type ViewMode = 'tree' | 'cards';
type CardSize = 'sm' | 'md' | 'lg';

export function Family() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ threshold: 0.1 });
  const { t } = useLanguage();
  const [view, setView] = useState<ViewMode>('tree');
  const [openBranch, setOpenBranch] = useState<string | null>(null);

  /** Card DOM nodes, so branch links can scroll to a person. */
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const info = (id: string) =>
    t.family.members[id] ?? { name: id, relation: '', context: '', occupation: '' };

  const photoFor = (id: string): string | null => {
    const person = people[id];
    if (!person) return null;
    if (person.photo) return familyPhotoUrl(person.photo);
    if (person.isPoet) return POET_FALLBACK_PHOTO;
    return null;
  };

  /** Scroll to a person and pulse their card. */
  const jumpToPerson = useCallback((id: string) => {
    const el = cardRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('tree-highlight');
    // Force reflow so the animation can replay on repeat clicks.
    void el.offsetWidth;
    el.classList.add('tree-highlight');
  }, []);

  // ── Person card ─────────────────────────────────────────────
  const PersonCard = ({
    id,
    size = 'md',
    showContext = true,
    dimmed = false,
  }: {
    id: string;
    size?: CardSize;
    showContext?: boolean;
    dimmed?: boolean;
  }) => {
    const person = people[id];
    if (!person) return null;

    const { name, relation, context, occupation } = info(id);
    const isPoet = Boolean(person.isPoet);

    return (
      <motion.div
        ref={(el) => {
          cardRefs.current[id] = el;
        }}
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'flex flex-col items-center text-center rounded-2xl transition-shadow duration-300',
          size === 'sm' ? 'p-3 w-[8.5rem]' : 'p-4 w-40 sm:w-44',
          isPoet
            ? 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/25 dark:to-orange-900/20 ring-2 ring-amber-400/70 shadow-lg shadow-amber-500/10'
            : 'bg-white dark:bg-slate-800/70 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm hover:shadow-md',
          dimmed && 'opacity-95'
        )}
      >
        <Avatar
          src={photoFor(id)}
          name={name}
          gender={person.gender}
          size={isPoet ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          className="mb-2.5"
        />

        <h4
          className={cn(
            'font-semibold text-slate-800 dark:text-slate-100 leading-snug',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}
        >
          {name}
        </h4>

        {relation && (
          <span
            className={cn(
              'mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium',
              isPoet
                ? 'bg-amber-200/70 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
            )}
          >
            {relation}
          </span>
        )}

        {showContext && context && (
          <p className="mt-1.5 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
            {context}
          </p>
        )}

        {occupation && (
          <p className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
            <Briefcase className="w-3 h-3 shrink-0" />
            {occupation}
          </p>
        )}
      </motion.div>
    );
  };

  /** A married couple, or a single person. */
  const UnitBlock = ({
    unit,
    size = 'md',
    isConnector = false,
  }: {
    unit: Unit;
    size?: CardSize;
    isConnector?: boolean;
  }) => (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-2xl',
          isConnector &&
            'ring-2 ring-dashed ring-emerald-400/70 dark:ring-emerald-500/50 p-1.5'
        )}
      >
        <PersonCard id={unit.primary} size={size} />
        {unit.spouse && (
          <>
            <Heart
              className="w-3.5 h-3.5 text-rose-400 shrink-0"
              fill="currentColor"
              aria-hidden="true"
            />
            <PersonCard id={unit.spouse} size={size} />
          </>
        )}
      </div>

      {unit.parentId && (
        <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
          {t.family.childOf} {info(unit.parentId).name}
        </p>
      )}
    </div>
  );

  // ── Tree view ───────────────────────────────────────────────
  const TreeBranch = ({ node, size = 'md' }: { node: TreeNode; size?: CardSize }) => (
    <li>
      <UnitBlock unit={node.unit} size={size} isConnector={node.isConnector} />
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeBranch key={child.unit.primary} node={child} size={size} />
          ))}
        </ul>
      )}
    </li>
  );

  const TreeView = ({ node, size = 'md' }: { node: TreeNode; size?: CardSize }) => (
    // Horizontal scroll keeps wide generations usable on small screens.
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <ul className="tree inline-flex min-w-full justify-center">
        <TreeBranch node={node} size={size} />
      </ul>
    </div>
  );

  // ── Branch panel (shared by both views) ─────────────────────
  const BranchBlock = ({ branch }: { branch: Branch }) => {
    const isOpen = openBranch === branch.key;
    const connector = info(branch.connectedTo);

    return (
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
        <button
          onClick={() => setOpenBranch(isOpen ? null : branch.key)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              src={photoFor(branch.connectedTo)}
              name={connector.name}
              gender={people[branch.connectedTo]?.gender ?? 'female'}
              size="sm"
              className="!w-10 !h-10 !text-sm"
            />
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                {t.family.branches[branch.key] ?? connector.name}
              </p>
              {/* Who this branch attaches through */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {t.family.connectedVia} {connector.name}
                {connector.context ? ` — ${connector.context}` : ''}
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            {isOpen ? t.family.hide : t.family.show}
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-300',
                isOpen && 'rotate-180'
              )}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-6 pt-1">
                {/* Jump link back to the connecting person */}
                <button
                  onClick={() => jumpToPerson(branch.connectedTo)}
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline underline-offset-2 decoration-dotted"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  {t.family.viewInTree}: {connector.name}
                </button>

                {view === 'tree' ? (
                  <TreeView node={branchToTree(branch)} size="sm" />
                ) : (
                  <div className="space-y-6">
                    {branch.parents.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                          {t.family.parentsLabel}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {branch.parents.map((id) => (
                            <PersonCard key={id} id={id} size="sm" />
                          ))}
                        </div>
                      </div>
                    )}

                    {branch.siblings.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                          {t.family.siblingsLabel}
                        </p>
                        <div className="space-y-4">
                          {branch.siblings.map((sibling: SiblingUnit) => (
                            <div
                              key={sibling.primary}
                              className="rounded-xl bg-white dark:bg-slate-900/40 ring-1 ring-slate-200/70 dark:ring-slate-700/70 p-3"
                            >
                              <div className="flex flex-wrap items-center gap-1.5">
                                <PersonCard id={sibling.primary} size="sm" />
                                {sibling.spouse && (
                                  <>
                                    <Heart
                                      className="w-3 h-3 text-rose-400 shrink-0"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    />
                                    <PersonCard id={sibling.spouse} size="sm" />
                                  </>
                                )}
                              </div>

                              {sibling.children && sibling.children.length > 0 && (
                                <div className="mt-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                                  <p className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mb-2">
                                    <CornerDownRight className="w-3 h-3" />
                                    {t.family.childOf} {info(sibling.primary).name}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {sibling.children.map((id) => (
                                      <PersonCard key={id} id={id} size="sm" />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      id="family"
      className="py-24 lg:py-32 bg-white dark:bg-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent dark:via-emerald-900/10" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
            <Users className="w-4 h-4 inline mr-1" />
            {t.family.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t.family.titlePrefix}{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              {t.family.titleHighlight}
            </span>{' '}
            {t.family.titleSuffix}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.family.description}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* View switch */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div
            role="group"
            className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700"
          >
            {(
              [
                { mode: 'tree', label: t.family.viewTree, Icon: Network },
                { mode: 'cards', label: t.family.viewCards, Icon: LayoutGrid },
              ] as const
            ).map(({ mode, label, Icon }) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300',
                  view === mode
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400'
                )}
              >
                {view === mode && (
                  <motion.span
                    layoutId="family-view-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25"
                  />
                )}
                <Icon className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Core family */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'tree' ? (
              <TreeView node={familyTree} />
            ) : (
              <div>
                {coreGenerations.map((generation, index) => (
                  <div key={generation.key}>
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <span className="h-px w-8 bg-slate-200 dark:bg-slate-700" />
                      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                        {t.family.generations[generation.key]}
                      </h3>
                      <span className="h-px w-8 bg-slate-200 dark:bg-slate-700" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
                      {generation.units.map((unit) => (
                        <UnitBlock key={unit.primary} unit={unit} />
                      ))}
                    </div>

                    {index < coreGenerations.length - 1 && (
                      <div className="flex justify-center py-4" aria-hidden="true">
                        <div className="w-px h-8 bg-gradient-to-b from-emerald-300 to-teal-300 dark:from-emerald-700 dark:to-teal-700" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Relatives by marriage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t.family.extendedTitle}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.family.extendedSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {branches.map((branch) => (
              <BranchBlock key={branch.key} branch={branch} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
