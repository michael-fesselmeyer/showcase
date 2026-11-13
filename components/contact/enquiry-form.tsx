'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useActionState, useEffect, useRef } from 'react'
import { submitEnquiry } from '@/app/contact/actions'
import { Magnetic } from '@/components/motion/magnetic'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { initialEnquiryState, type EnquiryState } from '@/lib/enquiry/handle'
import { budgets, projectTypes, timelines, type EnquiryField } from '@/lib/enquiry/schema'
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from '@/lib/enquiry/spam'
import { easing, seconds } from '@/lib/motion/tokens'
import { cn } from '@/lib/utils'

const errorId = (field: EnquiryField) => `${field}-error`

/**
 * The enquiry form. It posts to a server action and works without
 * JavaScript: native validation applies until the page hydrates, the
 * submitted values come back with any errors, and choices are plain radio
 * buttons. With JavaScript it shows pending, success and failure states in
 * place and moves focus to whatever needs attention.
 */
export function EnquiryForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialEnquiryState)
  const formRef = useRef<HTMLFormElement>(null)
  const startedRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLParagraphElement>(null)

  // Once hydrated, the server's messages replace the browser's tooltips, and
  // the clock for the time-to-submit check starts.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true
    if (startedRef.current) startedRef.current.value = String(Date.now())
  }, [])

  useEffect(() => {
    if (state.status === 'error') {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"], fieldset[data-invalid] input',
      )
      ;(firstInvalid ?? summaryRef.current)?.focus()
    }
  }, [state])

  const errors = state.status === 'error' ? state.fieldErrors : {}
  const values = state.status === 'error' ? state.values : {}

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === 'success' ? (
        <SuccessPanel key="success" />
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          action={formAction}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: seconds('fast') }}
          className="space-y-10"
          aria-describedby={state.status === 'error' ? 'form-summary' : undefined}
        >
          {state.status === 'error' && (
            <p
              id="form-summary"
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-small text-paper outline-none"
            >
              {state.message}
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              name="name"
              label="Your name"
              autoComplete="name"
              defaultValue={values.name}
              error={errors.name}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              defaultValue={values.email}
              error={errors.email}
            />
          </div>

          <ChoiceGroup
            name="projectType"
            legend="What are you looking for?"
            options={projectTypes}
            defaultValue={values.projectType}
            error={errors.projectType}
          />
          <ChoiceGroup
            name="budget"
            legend="Budget"
            options={budgets}
            defaultValue={values.budget}
            error={errors.budget}
          />
          <ChoiceGroup
            name="timeline"
            legend="Timeline"
            options={timelines}
            defaultValue={values.timeline}
            error={errors.timeline}
          />

          <div className="space-y-3">
            <Label htmlFor="details">Project details</Label>
            <Textarea
              id="details"
              name="details"
              required
              minLength={20}
              maxLength={4000}
              defaultValue={values.details}
              placeholder="What you are building, who it is for, and what success looks like."
              aria-invalid={errors.details ? true : undefined}
              aria-describedby={errors.details ? errorId('details') : undefined}
            />
            <FieldError field="details" message={errors.details} />
          </div>

          {/* Spam checks: a field people never see, and when the form appeared. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
            <input
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <input ref={startedRef} type="hidden" name={STARTED_AT_FIELD} defaultValue="" />

          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
            <p className="max-w-[40ch] text-small text-paper-faint">
              Your details are used only to reply to this enquiry.
            </p>
            <Magnetic>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-14 items-center gap-3 rounded-full bg-paper px-8 font-medium text-ink-950 transition-colors duration-(--duration-fast) hover:bg-white disabled:opacity-70"
              >
                {pending ? (
                  <>
                    <span
                      aria-hidden
                      className="size-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    Send enquiry <span aria-hidden>→</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>
          <p aria-live="polite" className="sr-only">
            {pending ? 'Sending your enquiry.' : ''}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

/** Shown in place of the form after a successful send; takes focus when it appears. */
function SuccessPanel() {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: seconds('slow'), ease: [...easing.out] }}
      className="rounded-3xl border border-line bg-ink-900 p-8 md:p-12"
      role="status"
    >
      <span aria-hidden className="text-brand-gradient headline text-h2">
        ✦
      </span>
      <h2 ref={heading} tabIndex={-1} className="mt-6 headline text-h2 outline-none">
        Thank you. Your enquiry is in.
      </h2>
      <p className="mt-4 max-w-[46ch] text-paper-muted">
        Expect a reply within two working days with a few questions and some times to talk.
      </p>
    </motion.div>
  )
}

function FieldError({ field, message }: { field: EnquiryField; message?: string }) {
  if (!message) return null
  return (
    <p id={errorId(field)} className="text-small text-[#ff8a8a]">
      {message}
    </p>
  )
}

type TextFieldProps = {
  name: EnquiryField
  label: string
  type?: 'text' | 'email'
  autoComplete: string
  defaultValue?: string
  error?: string
}

function TextField({
  name,
  label,
  type = 'text',
  autoComplete,
  defaultValue,
  error,
}: TextFieldProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId(name) : undefined}
      />
      <FieldError field={name} message={error} />
    </div>
  )
}

type ChoiceGroupProps = {
  name: EnquiryField
  legend: string
  options: Record<string, string>
  defaultValue?: string
  error?: string
}

/** Radio buttons styled as chips: no JavaScript needed, fully keyboard operable. */
function ChoiceGroup({ name, legend, options, defaultValue, error }: ChoiceGroupProps) {
  return (
    <fieldset
      aria-describedby={error ? errorId(name) : undefined}
      data-invalid={error ? '' : undefined}
      className="space-y-4"
    >
      <legend className="mb-4 text-small font-medium text-paper">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {Object.entries(options).map(([value, label], index) => (
          <label key={value} className="relative">
            <input
              type="radio"
              name={name}
              value={value}
              required={index === 0}
              defaultChecked={defaultValue === value}
              className="peer sr-only"
            />
            <span
              className={cn(
                'inline-flex h-11 items-center rounded-full border border-input px-5 text-small text-paper-muted transition-colors duration-(--duration-fast)',
                'hover:border-paper/60 hover:text-paper',
                'peer-checked:border-transparent peer-checked:bg-paper peer-checked:text-ink-950',
                'peer-focus-visible:ring-4 peer-focus-visible:ring-brand/40',
                error && 'border-destructive/70',
              )}
            >
              {label}
            </span>
          </label>
        ))}
      </div>
      <FieldError field={name} message={error} />
    </fieldset>
  )
}

export type { EnquiryState }
