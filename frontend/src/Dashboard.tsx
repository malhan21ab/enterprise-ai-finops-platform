import { useMemo, useState } from 'react'

type Employee = {
  id: number
  name: string
  department: string
  role: string
  tool: string
  costs: number
  tokens: number
  status: 'active' | 'critical' | 'complete'
}

type Toggle = {
  id: string
  label: string
  saving: number
  enabled: boolean
}

type Theme = {
  bg: string
  surface: string
  mutedSurface: string
  border: string
  text: string
  muted: string
  accent: string
  accentSoft: string
}

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const employees: Employee[] = [
  {
    id: 1,
    name: 'Malik Sadykov',
    department: 'Engineering',
    role: 'Staff Engineer',
    tool: 'GitHub Copilot',
    costs: 560,
    tokens: 420000,
    status: 'active',
  },
  {
    id: 2,
    name: 'Dana Lee',
    department: 'Product',
    role: 'Product Lead',
    tool: 'ChatGPT Team',
    costs: 380,
    tokens: 210000,
    status: 'complete',
  },
  {
    id: 3,
    name: 'Aruzhan Karim',
    department: 'Design',
    role: 'UX Designer',
    tool: 'Claude Team',
    costs: 240,
    tokens: 125000,
    status: 'critical',
  },
  {
    id: 4,
    name: 'Tim Park',
    department: 'Data',
    role: 'ML Engineer',
    tool: 'Cursor',
    costs: 720,
    tokens: 480000,
    status: 'active',
  },
  {
    id: 5,
    name: 'Sara Stone',
    department: 'Operations',
    role: 'Ops Manager',
    tool: 'OpenAI API',
    costs: 910,
    tokens: 360000,
    status: 'critical',
  },
  {
    id: 6,
    name: 'Nikita Volkov',
    department: 'Security',
    role: 'Security Analyst',
    tool: 'Codeium',
    costs: 180,
    tokens: 94000,
    status: 'complete',
  },
]

const defaultToggles: Toggle[] = [
  { id: 't1', label: 'Downgrade 5 unused Claude Pro seats', saving: 320, enabled: true },
  { id: 't2', label: 'Pause Copilot for inactive devs', saving: 480, enabled: true },
  { id: 't3', label: 'Switch ChatGPT Team to Enterprise', saving: 210, enabled: false },
  { id: 't4', label: 'Consolidate Cursor licenses', saving: 150, enabled: true },
  { id: 't5', label: 'Remove duplicate Codeium seats', saving: 90, enabled: false },
]

const lightTheme: Theme = {
  bg: '#f7f8fb',
  surface: '#ffffff',
  mutedSurface: '#f2f5f9',
  border: '#dfe5ee',
  text: '#172033',
  muted: '#6b7280',
  accent: '#ec4899',
  accentSoft: '#fdf2f8',
}

const darkTheme: Theme = {
  bg: '#0f1218',
  surface: '#191d27',
  mutedSurface: '#232834',
  border: '#303644',
  text: '#f5f7fb',
  muted: '#a8b0bf',
  accent: '#f472b6',
  accentSoft: '#402034',
}

export default function Dashboard() {
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState('')
  const [toggles, setToggles] = useState(defaultToggles)
  const [toast, setToast] = useState<string | null>(null)
  const [modal, setModal] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  const theme = dark ? darkTheme : lightTheme

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return employees
    return employees.filter((employee) =>
      [employee.name, employee.department, employee.role, employee.tool].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [search])

  const totalSavings = toggles.reduce(
    (sum, toggle) => sum + (toggle.enabled ? toggle.saving : 0),
    0,
  )
  const totalCosts = employees.reduce((sum, employee) => sum + employee.costs, 0) - totalSavings
  const totalTokens = employees.reduce((sum, employee) => sum + employee.tokens, 0)
  const criticalCount = employees.filter((employee) => employee.status === 'critical').length
  const criticalPct = Math.round((criticalCount / employees.length) * 100)
  const uniqueTools = new Set(employees.map((employee) => employee.tool)).size

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  return (
    <div
      className="dashboard"
      style={
        {
          '--bg': theme.bg,
          '--surface': theme.surface,
          '--muted-surface': theme.mutedSurface,
          '--border': theme.border,
          '--text': theme.text,
          '--muted': theme.muted,
          '--accent': theme.accent,
          '--accent-soft': theme.accentSoft,
        } as React.CSSProperties
      }
    >
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__mark">C</div>
          <span>CopilotOptima</span>
        </div>

        <nav className="nav">
          {['Dashboard', 'Employees', 'Tools', 'Alerts', 'Settings'].map((item, index) => (
            <button className={index === 0 ? 'nav__item nav__item--active' : 'nav__item'} type="button" key={item}>
              <NavIcon name={item} />
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="settings-strip">
          <div>
            <span className="settings-strip__label">Theme</span>
            <button className="switch" type="button" onClick={() => setDark((value) => !value)} aria-pressed={dark}>
              <span />
            </button>
          </div>
          <a className="api-link" href={`${apiUrl}/health`}>
            API health
          </a>
        </div>

        <div className="user">
          <div className="avatar">M</div>
          <div>
            <strong>Malik</strong>
            <span>Admin</span>
          </div>
        </div>
      </aside>

      <main className="dashboard__main">
        <section className="metrics">
          <MetricCard label="Total Spent" value={`$${Math.max(0, totalCosts).toLocaleString('en-US')}`} note="+14% vs last month">
            <Sparkline />
          </MetricCard>
          <MetricCard label="Token Usage" value={totalTokens.toLocaleString('en-US')} note="across all tools">
            <MeshWave />
          </MetricCard>
          <MetricCard label="Tools Used" value={String(uniqueTools)} note="connected services" large />
          <MetricCard label="Critical Waste" value={`${criticalPct}%`} note={`${criticalCount} employees`}>
            <Donut pct={criticalPct} />
          </MetricCard>
        </section>

        <section className="content-grid">
          <div className="stack">
            <section className="card">
              <div className="card__header">
                <h2>Cost Optimization</h2>
                <button className="compact-button compact-button--accent" type="button" onClick={() => showToast('Audit complete')}>
                  Audit All Licenses
                </button>
              </div>
              <div className="toggle-list">
                {toggles.map((toggle) => (
                  <div className="toggle-row" key={toggle.id}>
                    <button
                      className={toggle.enabled ? 'mini-switch mini-switch--on' : 'mini-switch'}
                      type="button"
                      onClick={() =>
                        setToggles((items) =>
                          items.map((item) =>
                            item.id === toggle.id ? { ...item, enabled: !item.enabled } : item,
                          ),
                        )
                      }
                      aria-pressed={toggle.enabled}
                    >
                      <span />
                    </button>
                    <span>{toggle.label}</span>
                    <strong>${toggle.saving}/mo</strong>
                  </div>
                ))}
              </div>
              <div className="saving-banner">Potential savings: ${totalSavings.toLocaleString('en-US')}/mo</div>
            </section>

            <section className="card">
              <div className="card__header">
                <h2>Core Tools Status</h2>
              </div>
              <div className="tool-grid">
                {[
                  ['OpenAI', '12 seats', 'Active'],
                  ['GitHub Copilot', '28 seats', 'Active'],
                  ['Anthropic', '8 seats', 'Warning'],
                ].map(([name, seats, status]) => (
                  <article className="tool-card" key={name}>
                    <div>
                      <span className="tool-card__icon" />
                      <strong>{name}</strong>
                    </div>
                    <p>{seats}</p>
                    <span className={status === 'Warning' ? 'status status--warn' : 'status'}>{status}</span>
                    <button className="compact-button" type="button" onClick={() => setModal(name)}>
                      Manage
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="card card--table">
              <div className="card__header card__header--wrap">
                <h2>Employee Spend Registry</h2>
                <div className="table-actions">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search employees..."
                  />
                  <button className="compact-button" type="button" onClick={() => setModal('Filter Settings')}>
                    Filter
                  </button>
                  <button className="compact-button compact-button--dark" type="button" onClick={() => showToast('Report generated')}>
                    Export
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Job Title</th>
                      <th>Connected Tool</th>
                      <th>Cost / Month</th>
                      <th>Usage Rank</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="person">
                            <div className="avatar avatar--small">{employee.name[0]}</div>
                            <div>
                              <strong>{employee.name}</strong>
                              <span>{employee.department}</span>
                            </div>
                          </div>
                        </td>
                        <td>{employee.role}</td>
                        <td>
                          <span className="chip">{employee.tool}</span>
                        </td>
                        <td>${employee.costs.toLocaleString('en-US')}</td>
                        <td>
                          <div className="usage">
                            <span style={{ width: `${Math.min(100, (employee.tokens / 500000) * 100)}%` }} />
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge--${employee.status}`}>{employee.status}</span>
                        </td>
                        <td>
                          <button className="text-button" type="button" onClick={() => showToast(`Congratulation sent to ${employee.name}`)}>
                            Congratulate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="insights">
            <section className="card">
              <h2>Performance & Sharing</h2>
              <Radar />
            </section>
            <section className="card">
              <h2>AI Activity Log</h2>
              <div className="activity">
                {[
                  ['09:14', 'Audited GitHub Copilot licenses'],
                  ['11:32', 'Flagged 3 unused ChatGPT seats'],
                  ['14:05', 'Claude Team billing synced'],
                  ['16:48', 'Weekly cost report generated'],
                ].map(([time, message], index) => (
                  <div className="activity__item" key={message}>
                    <time>{time}</time>
                    <span className={index === 1 ? 'activity__dot activity__dot--warn' : 'activity__dot'} />
                    <p>{message}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="card">
              <h2>Top Employees</h2>
              <div className="top-list">
                {employees.slice(0, 4).map((employee) => (
                  <div className="top-list__item" key={employee.id}>
                    <div className="person">
                      <div className="avatar avatar--small">{employee.name[0]}</div>
                      <strong>{employee.name}</strong>
                    </div>
                    <button className="text-button" type="button" onClick={() => showToast('Prompt shared')}>
                      Share Prompt
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <button className="chat-button" type="button" onClick={() => setChatOpen((value) => !value)} aria-label="Open AI copilot">
        <ChatIcon />
      </button>

      {chatOpen && (
        <section className="chat-panel">
          <div className="chat-panel__header">
            <strong>CopilotOptima AI</strong>
            <button type="button" onClick={() => setChatOpen(false)}>
              x
            </button>
          </div>
          <p>
            Hi. I noticed you can save $1,240/mo by consolidating unused seats.
            Want me to draft an optimization plan?
          </p>
          <button className="compact-button compact-button--accent" type="button" onClick={() => showToast('Optimization plan queued')}>
            Accept suggestion
          </button>
        </section>
      )}

      {modal && (
        <div className="modal" onClick={() => setModal(null)}>
          <section className="modal__panel" onClick={(event) => event.stopPropagation()}>
            <h2>{modal}</h2>
            <p>Seat, billing, and access configuration will live here.</p>
            <div>
              <button className="compact-button" type="button" onClick={() => setModal(null)}>
                Close
              </button>
              <button
                className="compact-button compact-button--accent"
                type="button"
                onClick={() => {
                  setModal(null)
                  showToast('Settings saved')
                }}
              >
                Save
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function MetricCard({
  label,
  value,
  note,
  large,
  children,
}: {
  label: string
  value: string
  note: string
  large?: boolean
  children?: React.ReactNode
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong className={large ? 'metric-card__value metric-card__value--large' : 'metric-card__value'}>{value}</strong>
      <p>{note}</p>
      {children}
    </article>
  )
}

function Sparkline() {
  return (
    <svg className="mini-chart" viewBox="0 0 240 46" preserveAspectRatio="none">
      <path d="M0 36 L28 32 L56 30 L84 20 L112 24 L140 12 L168 8 L196 14 L240 4" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <path d="M0 36 L28 32 L56 30 L84 20 L112 24 L140 12 L168 8 L196 14 L240 4 L240 46 L0 46 Z" fill="var(--accent-soft)" />
    </svg>
  )
}

function MeshWave() {
  return (
    <svg className="mini-chart" viewBox="0 0 240 48">
      {[8, 18, 28, 38].map((y) => (
        <path key={y} d={`M0 ${y} C44 ${y - 8}, 76 ${y + 8}, 120 ${y} S196 ${y - 8}, 240 ${y}`} fill="none" stroke="var(--border)" />
      ))}
      <circle cx="62" cy="15" r="4" fill="var(--accent)" />
      <circle cx="142" cy="29" r="4" fill="var(--accent)" />
      <circle cx="210" cy="14" r="4" fill="var(--accent)" />
    </svg>
  )
}

function Donut({ pct }: { pct: number }) {
  const radius = 19
  const circumference = 2 * Math.PI * radius

  return (
    <svg className="donut" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle
        cx="26"
        cy="26"
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
        transform="rotate(-90 26 26)"
      />
    </svg>
  )
}

function Radar() {
  return (
    <svg className="radar" viewBox="0 0 180 160">
      <polygon points="90,18 156,62 132,136 48,136 24,62" fill="none" stroke="var(--border)" />
      <polygon points="90,42 128,68 114,112 66,112 52,68" fill="none" stroke="var(--border)" />
      <polygon points="90,28 138,70 112,120 64,116 44,72" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="2" />
      {[
        [90, 28],
        [138, 70],
        [112, 120],
        [64, 116],
        [44, 72],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="var(--accent)" />
      ))}
      {['Copilot', 'ChatGPT', 'Claude', 'Cursor', 'Codeium'].map((label, index) => {
        const points = [
          [90, 9],
          [166, 58],
          [138, 150],
          [42, 150],
          [14, 58],
        ]
        const [x, y] = points[index]
        return (
          <text key={label} x={x} y={y} textAnchor="middle" fill="var(--muted)" fontSize="9">
            {label}
          </text>
        )
      })}
    </svg>
  )
}

function NavIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (name === 'Employees') {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }

  if (name === 'Tools') {
    return (
      <svg {...common}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-8 8l-7 7a2.1 2.1 0 0 1-3-3l7-7a6 6 0 0 1 8-8z" />
      </svg>
    )
  }

  if (name === 'Alerts') {
    return (
      <svg {...common}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    )
  }

  if (name === 'Settings') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
