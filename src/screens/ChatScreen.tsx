import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import ChartCard from '../components/ChartCard'
import { CheckIcon, PinIcon, SendIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import { replyTo, starterQuestions } from '../data/chatScript'
import type { ChartSpec, ChatMessage } from '../data/types'
import { useApp } from '../state/AppContext'
import './ChatScreen.css'

let nextId = 1
const newId = () => `m${nextId++}`

export default function ChatScreen() {
  const { state, dispatch } = useApp()
  const messages = state.chat
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, thinking])

  const lastChart = [...messages].reverse().find((m) => m.chart)?.chart

  function ask(question: string) {
    const text = question.trim()
    if (!text || thinking) return
    dispatch({ type: 'chatAdd', message: { id: newId(), role: 'user', text } })
    setDraft('')
    setThinking(true)

    // Pretend to think for a moment, like a real model would.
    const reply = replyTo(text, lastChart)
    setTimeout(() => {
      const id = newId()
      // Each answer's chart gets its own id, so it can be pinned separately.
      const chart = reply.chart && { ...reply.chart, id: `${reply.chart.id}-${id}` }
      dispatch({ type: 'chatAdd', message: { ...reply, chart, id, role: 'assistant' } })
      setThinking(false)
    }, 900)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault() // stop the browser reloading the page on form submit
    ask(draft)
  }

  return (
    <div className="chat">
      <PageHeader title="Ask Studio" subtitle="Ask a question about your sales data in plain language." />

      {/* aria-live: screen readers announce new answers as they arrive. */}
      <div className="chat__log" aria-live="polite">
        {messages.length === 0 && (
          <div className="chat__empty">
            <p className="chat__empty-title">What would you like to know?</p>
            <Suggestions items={starterQuestions} onPick={ask} />
          </div>
        )}

        {messages.map((m, i) =>
          m.role === 'user' ? (
            <p key={m.id} className="chat__bubble">
              {m.text}
            </p>
          ) : (
            <Answer key={m.id} message={m} isLatest={i === messages.length - 1} onPick={ask} />
          ),
        )}

        {thinking && (
          <p className="chat__thinking">
            <span className="chat__dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            Studio is looking at your data…
          </p>
        )}
        <div ref={endRef} />
      </div>

      <form className="chat__composer" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="sr-only">
          Ask a question
        </label>
        <input
          id="chat-input"
          className="chat__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about your data…"
          autoComplete="off"
          enterKeyHint="send"
        />
        <button className="btn btn--primary btn--icon" type="submit" aria-label="Send" disabled={!draft.trim() || thinking}>
          <SendIcon />
        </button>
      </form>
    </div>
  )
}

function Suggestions({ items, onPick }: { items: string[]; onPick: (q: string) => void }) {
  return (
    <div className="chat__suggestions">
      {items.map((q) => (
        <button key={q} className="chip" onClick={() => onPick(q)}>
          {q}
        </button>
      ))}
    </div>
  )
}

function Answer({ message, isLatest, onPick }: { message: ChatMessage; isLatest: boolean; onPick: (q: string) => void }) {
  return (
    <div className="chat__answer">
      <p className="chat__answer-text">{message.text}</p>
      {message.chart && <ChartCard chart={message.chart} actions={<PinButton chart={message.chart} />} />}
      {/* Follow-ups only under the newest answer, so old ones don't clutter the log. */}
      {isLatest && message.suggestions && <Suggestions items={message.suggestions} onPick={onPick} />}
    </div>
  )
}

function PinButton({ chart }: { chart: ChartSpec }) {
  const { state, dispatch } = useApp()
  const pinned = state.pinned.some((c) => c.id === chart.id)

  if (pinned) {
    return (
      <Link to="/dashboard" className="btn btn--ghost chat__pinned">
        <CheckIcon />
        Pinned
      </Link>
    )
  }
  return (
    <button className="btn btn--ghost" onClick={() => dispatch({ type: 'pinChart', chart })}>
      <PinIcon />
      Pin
    </button>
  )
}
