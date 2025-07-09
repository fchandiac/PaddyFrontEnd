"use client";

import { producerInputRef } from "./ReceptionGeneralData";

export function focusOnProducer(): void {
  if (producerInputRef.current) {
    producerInputRef.current.focus();
  }
}
