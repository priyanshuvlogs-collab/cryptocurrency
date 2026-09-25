"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useId, useRef } from "react";
import type { FormState } from "@/app/actions";
import { useLocale } from "@/components/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

const ErrorsContext = createContext<Record<string, string>>({});

/**
 * Progressive, accessible form shell: server action + honeypot + time trap,
 * inline field errors, announced status, and a GA4 event on success.
 */
export function SmartForm({
  action,
  event,
  children,
  submitLabel,
  className = "",
  hideOnSuccess = true,
}: {
  action: Action;
  event: string;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  hideOnSuccess?: boolean;
}) {
  const { locale, m } = useLocale();
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState);
  const tRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tRef.current) tRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "success") trackEvent(event);
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state, event]);

  if (state.status === "success" && hideOnSuccess) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="card grid gap-4 p-6 outline-none">
        <p className="flex items-start gap-3 text-lg font-semibold">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-whatsapp text-on-whatsapp">
            <CheckIcon size={18} />
          </span>
          {state.message}
        </p>
        {state.followUp ? (
          <a href={state.followUp.href} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-fit">
            <WhatsAppIcon /> {state.followUp.label}
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <ErrorsContext.Provider value={state.fieldErrors || {}}>
      <form
        className={`grid gap-5 ${className}`}
        onSubmit={(e) => {
          // Dispatch manually (instead of action={...}) so fields keep their
          // values when the server returns validation errors.
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => formAction(fd));
        }}
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="_t" ref={tRef} defaultValue="" />
        {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            {m.forms.honeypot}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {children}
        <div
          ref={statusRef}
          tabIndex={-1}
          role={state.status === "error" ? "alert" : "status"}
          className="outline-none empty:hidden"
        >
          {state.status === "error" && state.message ? <p className="field-error text-base">{state.message}</p> : null}
        </div>
        <SubmitButton label={submitLabel || m.forms.submit} pending={pending} />
      </form>
    </ErrorsContext.Provider>
  );
}

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  const { m } = useLocale();
  return (
    <button type="submit" className="btn btn-primary btn-lg w-full sm:w-fit" disabled={pending} aria-disabled={pending}>
      {pending ? m.forms.sending : label}
    </button>
  );
}

/* ── Fields ──────────────────────────────────────────────────────────── */

function useField(name: string) {
  const errors = useContext(ErrorsContext);
  const id = useId();
  const error = errors[name];
  return {
    id,
    error,
    a11y: {
      id,
      name,
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": error ? `${id}-err` : undefined,
    },
  };
}

function Label({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  const { m } = useLocale();
  return (
    <label htmlFor={htmlFor}>
      {label}
      {required ? (
        <span className="text-live" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
      {required ? <span className="sr-only"> ({m.forms.required})</span> : null}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={`${id}-err`} className="field-error">
      {error}
    </p>
  ) : null;
}

export function TextField({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  placeholder,
  inputMode,
  hint,
  min,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  min?: string;
  maxLength?: number;
}) {
  const { id, error, a11y } = useField(name);
  return (
    <div className="field">
      <Label htmlFor={id} label={label} required={required} />
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      <input
        {...a11y}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        min={min}
        maxLength={maxLength}
        className="input"
      />
      <ErrorText id={id} error={error} />
    </div>
  );
}

export function TextArea({
  name,
  label,
  required,
  rows = 4,
  maxLength,
  hint,
}: {
  name: string;
  label: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  hint?: string;
}) {
  const { id, error, a11y } = useField(name);
  return (
    <div className="field">
      <Label htmlFor={id} label={label} required={required} />
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      <textarea {...a11y} required={required} rows={rows} maxLength={maxLength} className="input" />
      <ErrorText id={id} error={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
}) {
  const { id, error, a11y } = useField(name);
  return (
    <div className="field">
      <Label htmlFor={id} label={label} required={required} />
      <select {...a11y} required={required} defaultValue={defaultValue ?? ""} className="input">
        {!defaultValue ? <option value="">—</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ErrorText id={id} error={error} />
    </div>
  );
}

/** Large, thumb-friendly radio cards. */
export function ChoiceGroup({
  name,
  legend,
  options,
  defaultValue,
  required,
  columns = 2,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string; description?: string }[];
  defaultValue?: string;
  required?: boolean;
  columns?: 2 | 3 | 5;
}) {
  const errors = useContext(ErrorsContext);
  const error = errors[name];
  const id = useId();
  const cols = columns === 5 ? "sm:grid-cols-5" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <fieldset className="field" aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="mb-2">
        {legend}
        {required ? <span className="text-live"> *</span> : null}
      </legend>
      <div className={`grid grid-cols-2 gap-2 ${cols}`}>
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-12 cursor-pointer flex-col justify-center rounded-xl border-[1.5px] border-line bg-surface px-3 py-2 has-checked:border-magenta has-checked:bg-surface-2 has-focus-visible:outline-3 has-focus-visible:outline-saffron"
          >
            <span className="flex items-center gap-2 font-semibold">
              <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} required={required} className="accent-[var(--magenta)]" />
              {o.label}
            </span>
            {o.description ? <span className="mt-0.5 text-sm text-muted">{o.description}</span> : null}
          </label>
        ))}
      </div>
      <ErrorText id={id} error={error} />
    </fieldset>
  );
}

export function ConsentField({ name = "consent", label }: { name?: string; label?: string }) {
  const { m } = useLocale();
  const { id, error, a11y } = useField(name);
  return (
    <div className="field">
      <label htmlFor={id} className="flex items-start gap-3 font-normal!">
        <input {...a11y} type="checkbox" required className="mt-1 size-5 shrink-0 accent-[var(--saffron)]" />
        <span className="text-sm">{label || m.forms.consent}</span>
      </label>
      <ErrorText id={id} error={error} />
    </div>
  );
}
