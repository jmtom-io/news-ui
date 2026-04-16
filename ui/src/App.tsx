import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface DigestItem {
  type: 'tweet' | 'podcast' | 'article'
  author: string
  role: string | null
  title: string | null
  content_en: string
  content_zh: string | null
  url: string
  published_at: string | null
}

interface Digest {
  date: string
  source: string
  language: string
  items: DigestItem[]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatPublished(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function itemMatches(item: DigestItem, query: string) {
  const q = query.toLowerCase()
  return [item.author, item.role, item.title, item.content_en, item.content_zh]
    .some(field => field?.toLowerCase().includes(q))
}

function TweetCard({ tweet, featured, bilingual }: { tweet: DigestItem; featured?: boolean; bilingual: boolean }) {
  return (
    <article className={featured ? 'mb-10' : 'break-inside-avoid mb-10 border-t border-[var(--color-line)] pt-6'}>
      <div className={featured ? 'mb-4 flex items-baseline gap-3' : 'mb-3'}>
        <h4 className={`font-sans font-bold uppercase tracking-widest text-[var(--color-ink)] ${featured ? 'text-base' : 'text-sm'}`}>
          {tweet.author}
        </h4>
        {tweet.role && (
          <span className={`font-sans text-[var(--color-ink-light)] ${featured ? 'text-sm' : 'text-xs mt-1 block'}`}>
            {tweet.role}
          </span>
        )}
        {tweet.published_at && (
          <span className="font-sans text-xs text-[var(--color-ink-light)]">
            {formatPublished(tweet.published_at)}
          </span>
        )}
      </div>
      <a href={tweet.url} target="_blank" rel="noopener noreferrer">
        <blockquote className={`font-serif font-medium text-[var(--color-ink)] hover:text-[var(--color-ink-light)] transition-colors leading-snug ${featured ? 'text-xl md:text-2xl' : 'text-xl leading-relaxed'}`}>
          "{tweet.content_en}"
        </blockquote>
      </a>
      {bilingual && tweet.content_zh && (
        <blockquote className={`font-serif text-[var(--color-ink-light)] mt-2 leading-relaxed ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          "{tweet.content_zh}"
        </blockquote>
      )}
    </article>
  )
}

function PodcastCard({ item, bordered, bilingual }: { item: DigestItem; bordered: boolean; bilingual: boolean }) {
  return (
    <article className={bordered ? 'border-b border-[var(--color-line)] pb-8' : ''}>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-sans text-sm font-bold uppercase tracking-widest text-[var(--color-ink-light)]">
          {item.author}
        </span>
        {item.published_at && (
          <span className="font-sans text-xs text-[var(--color-ink-light)]">
            {formatPublished(item.published_at)}
          </span>
        )}
      </div>
      {item.title && (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <h4 className="font-serif text-2xl font-bold leading-tight mb-3 text-[var(--color-ink)] hover:text-[var(--color-ink-light)] transition-colors">
            {item.title}
          </h4>
        </a>
      )}
      <p className="text-base leading-relaxed text-[var(--color-ink-light)]">{item.content_en}</p>
      {bilingual && item.content_zh && (
        <p className="text-base leading-relaxed text-[var(--color-ink-light)] mt-3">{item.content_zh}</p>
      )}
    </article>
  )
}

function DigestSection({ digest, index, total }: { digest: Digest; index: number; total: number }) {
  const tweets = digest.items.filter(i => i.type === 'tweet')
  const podcasts = digest.items.filter(i => i.type === 'podcast')
  const articles = digest.items.filter(i => i.type === 'article')
  const bilingual = digest.language === 'bilingual'
  const rightItems = [...podcasts, ...articles]

  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="font-sans text-xl md:text-2xl font-medium text-[var(--color-ink)]">
          {formatDate(digest.date)}
        </h2>
        <p className="font-sans text-xs uppercase tracking-widest text-[var(--color-ink-light)] mt-1">
          {digest.source}
        </p>
      </motion.div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {tweets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.2 }}
            className={rightItems.length > 0 ? 'lg:col-span-8 lg:border-r border-[var(--color-line)] lg:pr-12' : 'lg:col-span-12'}
          >
            <div className="border-b-4 border-[var(--color-line-dark)] pb-2 mb-8">
              <h3 className="font-sans text-lg font-black uppercase tracking-widest text-[var(--color-ink)]">X / Twitter</h3>
            </div>
            <TweetCard tweet={tweets[0]} featured bilingual={bilingual} />
            {tweets.length > 1 && (
              <div className="columns-1 md:columns-2 gap-10">
                {tweets.slice(1).map((tweet, i) => (
                  <TweetCard key={i} tweet={tweet} bilingual={bilingual} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {rightItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.4 }}
            className={tweets.length > 0 ? 'lg:col-span-4' : 'lg:col-span-12'}
          >
            {podcasts.length > 0 && (
              <>
                <div className="border-b-4 border-[var(--color-line-dark)] pb-2 mb-8">
                  <h3 className="font-sans text-lg font-black uppercase tracking-widest text-[var(--color-ink)]">Podcast</h3>
                </div>
                <div className="flex flex-col gap-8 mb-12">
                  {podcasts.map((p, i) => (
                    <PodcastCard key={i} item={p} bordered={i !== podcasts.length - 1} bilingual={bilingual} />
                  ))}
                </div>
              </>
            )}
            {articles.length > 0 && (
              <>
                <div className="border-b-4 border-[var(--color-line-dark)] pb-2 mb-8">
                  <h3 className="font-sans text-lg font-black uppercase tracking-widest text-[var(--color-ink)]">Articles</h3>
                </div>
                <div className="flex flex-col gap-8">
                  {articles.map((a, i) => (
                    <PodcastCard key={i} item={a} bordered={i !== articles.length - 1} bilingual={bilingual} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </main>

      {index !== total - 1 && (
        <div className="mt-24 border-b-2 border-dashed border-[var(--color-line)]" />
      )}
    </section>
  )
}

function Sidebar({
  allMeta,
  sources,
  selectedSource,
  onSelectSource,
  selectedDate,
  onSelectDate,
  searchQuery,
  onSearchChange,
  open,
  onClose,
}: {
  allMeta: DigestMeta[]
  sources: string[]
  selectedSource: string | null
  onSelectSource: (s: string | null) => void
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-30"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            className="fixed top-0 left-0 h-full w-80 bg-[var(--color-paper)] border-r border-[var(--color-line)] z-40 flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-8 border-b border-[var(--color-line)]">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">Archive</span>
            </div>

            {/* Search */}
            <div className="px-5 py-4 border-b border-[var(--color-line)]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-light)]" width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm font-sans bg-[#F5F5F5] rounded text-[var(--color-ink)] placeholder-[var(--color-ink-light)] outline-none focus:ring-1 focus:ring-[var(--color-ink)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-light)] hover:text-[var(--color-ink)]"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Source filter — only shown when 2+ sources exist */}
            {sources.length >= 2 && (
              <div className="px-5 py-3 border-b border-[var(--color-line)] flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectSource(null)}
                  className={`font-sans text-[10px] uppercase tracking-widest px-2 py-1 rounded transition-colors ${
                    !selectedSource
                      ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                      : 'text-[var(--color-ink-light)] hover:bg-[var(--color-line)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  All
                </button>
                {sources.map(s => (
                  <button
                    key={s}
                    onClick={() => onSelectSource(s)}
                    className={`font-sans text-[10px] uppercase tracking-widest px-2 py-1 rounded transition-colors ${
                      selectedSource === s
                        ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                        : 'text-[var(--color-ink-light)] hover:bg-[var(--color-line)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Date list */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              <button
                onClick={() => { onSelectDate(null); onSearchChange('') }}
                className={`w-full text-left px-3 py-2 rounded text-sm font-sans transition-colors mb-1 ${
                  !selectedDate && !searchQuery
                    ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                    : 'text-[var(--color-ink-light)] hover:bg-[var(--color-line)] hover:text-[var(--color-ink)]'
                }`}
              >
                All Updates
              </button>
              {allMeta
                .filter(m => !selectedSource || m.source === selectedSource)
                .map(m => (
                  <button
                    key={m.file}
                    onClick={() => onSelectDate(m.date)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors mb-1 ${
                      selectedDate === m.date && (!selectedSource || m.source === selectedSource)
                        ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                        : 'text-[var(--color-ink-light)] hover:bg-[var(--color-line)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    <span className="font-sans text-sm block">{formatDateShort(m.date)}</span>
                    {!selectedSource && (
                      <span className="font-sans text-xs text-[var(--color-ink-light)]">{m.source}</span>
                    )}
                  </button>
                ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

interface DigestMeta { date: string; source: string; file: string }

export default function App() {
  const [digests, setDigests] = useState<Digest[]>([])
  const [allMeta, setAllMeta] = useState<DigestMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Initial load: latest 7 digests + full date list for sidebar
  useEffect(() => {
    Promise.all([
      fetch('/api/digests').then(r => r.json()),
      fetch('/api/digest-list').then(r => r.json()),
    ]).then(([data, meta]: [Digest[], DigestMeta[]]) => {
      setDigests(data)
      setAllMeta(meta)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Load a specific digest on demand if not already loaded
  const loadDigest = async (meta: DigestMeta) => {
    const alreadyLoaded = digests.some(d => d.date === meta.date && d.source === meta.source)
    if (alreadyLoaded) return
    try {
      const data: Digest = await fetch(`/api/digest?file=${meta.file}`).then(r => r.json())
      setDigests(prev => [...prev, data].sort((a, b) => b.date.localeCompare(a.date)))
    } catch { /* ignore */ }
  }

  const handleSelectDate = (date: string | null) => {
    setSelectedDate(date)
    if (date) {
      setSearchQuery('')
      const meta = allMeta.find(m => m.date === date && (!selectedSource || m.source === selectedSource))
      if (meta) loadDigest(meta)
    }
  }

  const handleSelectSource = (source: string | null) => {
    setSelectedSource(source)
    setSelectedDate(null)
  }

  const filteredDigests = useMemo(() => {
    let result = digests
    if (selectedSource) result = result.filter(d => d.source === selectedSource)
    if (searchQuery.trim()) {
      return result
        .map(d => ({ ...d, items: d.items.filter(item => itemMatches(item, searchQuery)) }))
        .filter(d => d.items.length > 0)
    }
    if (selectedDate) return result.filter(d => d.date === selectedDate)
    return result
  }, [digests, selectedDate, selectedSource, searchQuery])

  const sources = useMemo(() => [...new Set(allMeta.map(m => m.source))], [allMeta])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-serif text-2xl text-[var(--color-ink-light)]">Loading...</span>
      </div>
    )
  }

  if (digests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 text-center">
        <div>
          <h1 className="font-serif text-4xl font-black text-[var(--color-ink)] mb-4">The News</h1>
          <p className="font-sans text-[var(--color-ink-light)]">No digests yet. Run your information skill to generate your first one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen selection:bg-[var(--color-ink)] selection:text-[var(--color-paper)]">

      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 text-[var(--color-ink-light)] hover:text-[var(--color-ink)] transition-colors"
        aria-label="Open sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <Sidebar
        allMeta={allMeta}
        sources={sources}
        selectedSource={selectedSource}
        onSelectSource={handleSelectSource}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        searchQuery={searchQuery}
        onSearchChange={q => { setSearchQuery(q); if (q) setSelectedDate(null) }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="max-w-6xl mx-auto px-8 sm:px-16 lg:px-20 py-8 md:py-12">

        {/* Search active banner */}
        {(searchQuery || selectedDate) && (
          <div className="mb-12 flex items-center gap-3">
            <span className="font-sans text-sm text-[var(--color-ink-light)]">
              {searchQuery
                ? `${filteredDigests.reduce((n, d) => n + d.items.length, 0)} results for "${searchQuery}"`
                : `Showing ${formatDateShort(selectedDate!)}`}
            </span>
            <button
              onClick={() => { setSelectedDate(null); setSearchQuery('') }}
              className="font-sans text-xs uppercase tracking-widest text-[var(--color-ink-light)] hover:text-[var(--color-ink)] underline transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {filteredDigests.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-serif text-2xl text-[var(--color-ink-light)]">No results found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-24 md:gap-32">
            {filteredDigests.map((digest, i) => (
              <DigestSection key={`${digest.date}-${digest.source}`} digest={digest} index={i} total={filteredDigests.length} />
            ))}
          </div>
        )}

        <footer className="mt-24 pt-3 border-t border-[var(--color-line-dark)]">
          <span className="font-sans text-sm uppercase tracking-widest text-[var(--color-ink-light)]">Powered by news-ui</span>
        </footer>
      </div>
    </div>
  )
}
