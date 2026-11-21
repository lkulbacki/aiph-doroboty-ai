"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FormSelectOption = {
  value: string;
  label: string;
};

export function FormSelect({
  id,
  name,
  value,
  defaultValue,
  options,
  placeholder = "Wybierz",
  ariaLabel,
  required,
  disabled,
  className,
  triggerClassName,
  contentClassName,
  onValueChange,
  progressiveFallback = false,
  searchable = false,
  describedBy,
  error,
}: {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  options: FormSelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  onValueChange?: (value: string) => void;
  progressiveFallback?: boolean;
  searchable?: boolean;
  describedBy?: string;
  error?: string;
}) {
  const generatedId = React.useId();
  const errorId = `${id ?? generatedId}-error`;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [touched, setTouched] = React.useState(false);
  const clearRef = React.useRef<HTMLButtonElement>(null);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selectedValue = value ?? internalValue;
  const selectedLabel = options.find((option) => option.value === selectedValue)?.label;

  const missing = Boolean(required && !disabled && !selectedLabel);
  const validationMessage = error || (touched && missing ? "Wybierz opcję z listy." : "");
  const description =
    [describedBy, validationMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  React.useEffect(() => {
    inputRef.current?.setCustomValidity(missing ? "Wybierz opcję z listy." : "");
  }, [missing]);

  return (
    <span className={cn("block min-w-0", className)}>
      {searchable ? (
        <Combobox.Root
          items={options}
          name={name}
          value={options.find((option) => option.value === selectedValue) ?? null}
          isItemEqualToValue={(item, selected) => item.value === selected.value}
          onValueChange={(option) => {
            const next = option?.value ?? "";
            setInternalValue(next);
            onValueChange?.(next);
          }}
          required={required}
          disabled={disabled}
          openOnInputClick
          autoHighlight
          onOpenChangeComplete={(open) => {
            const anchor = anchorRef.current;
            if (
              open &&
              anchor &&
              window.innerHeight - anchor.getBoundingClientRect().bottom < 280
            ) {
              anchor.scrollIntoView({ block: "center", behavior: "instant" });
            }
          }}
        >
          <span ref={anchorRef} className="editaurus-form-combobox">
            <Combobox.Input
              ref={inputRef}
              id={id}
              aria-required={required || undefined}
              aria-invalid={Boolean(validationMessage) || undefined}
              aria-describedby={description}
              onBlur={() => setTouched(true)}
              onInvalid={() => setTouched(true)}
              aria-label={ariaLabel}
              placeholder={placeholder}
              onFocus={(event) => event.currentTarget.select()}
              onClick={(event) => {
                if (event.currentTarget.value === selectedLabel) event.currentTarget.select();
              }}
              onKeyDown={(event) => {
                if (
                  (event.key === "Backspace" || event.key === "Delete") &&
                  selectedValue &&
                  event.currentTarget.value === selectedLabel
                ) {
                  event.preventDefault();
                  clearRef.current?.click();
                }
              }}
              className="editaurus-combobox-input"
            />
            {selectedValue ? (
              <Combobox.Clear
                ref={clearRef}
                aria-label={`Wyczyść: ${ariaLabel ?? placeholder}`}
                className="editaurus-combobox-toggle"
                tabIndex={0}
              >
                <X size={17} aria-hidden="true" />
              </Combobox.Clear>
            ) : (
              <Combobox.Trigger
                aria-label={`Rozwiń: ${ariaLabel ?? placeholder}`}
                className="editaurus-combobox-toggle"
              >
                <ChevronDown size={16} aria-hidden="true" />
              </Combobox.Trigger>
            )}
          </span>
          <Combobox.Portal>
            <Combobox.Positioner
              anchor={anchorRef}
              side="bottom"
              collisionAvoidance={{ side: "none", align: "shift", fallbackAxisSide: "none" }}
              align="start"
              sideOffset={8}
              className="editorial-location-positioner"
            >
              <Combobox.Popup
                tabIndex={0}
                aria-label={`Wybierz: ${ariaLabel ?? placeholder}`}
                className="editaurus-surface editorial-picker-menu"
              >
                <Combobox.Empty className="editorial-location-empty">
                  Brak pasujących opcji.
                </Combobox.Empty>
                <Combobox.List>
                  {(option: FormSelectOption) => (
                    <Combobox.Item
                      key={option.value}
                      value={option}
                      className="editorial-location-option editaurus-combobox-option"
                    >
                      {option.label}
                      <Combobox.ItemIndicator>
                        <Check size={16} strokeWidth={3} aria-hidden="true" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      ) : (
        <Select
          name={name}
          value={selectedValue}
          onValueChange={(nextValue) => {
            const normalized = nextValue ?? "";
            setInternalValue(normalized);
            onValueChange?.(normalized);
          }}
          required={required}
          disabled={disabled}
        >
          <SelectTrigger
            id={id}
            aria-label={ariaLabel}
            aria-required={required || undefined}
            aria-invalid={Boolean(validationMessage) || undefined}
            aria-describedby={description}
            className={cn("w-full", triggerClassName)}
          >
            <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent
            align="start"
            alignItemWithTrigger={false}
            sideOffset={8}
            className={contentClassName}
          >
            {options.map((option) => (
              <SelectItem key={option.value || "__all"} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {validationMessage && (
        <span id={errorId} className="editaurus-form-error mt-2 block" role="alert">
          {validationMessage}
        </span>
      )}
      {progressiveFallback && name ? (
        <noscript>
          <select
            className="native-select mt-2"
            aria-label={ariaLabel}
            name={name}
            defaultValue={defaultValue}
            required={required}
            disabled={disabled}
          >
            {options.map((option) => (
              <option key={option.value || "__all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </noscript>
      ) : null}
    </span>
  );
}
