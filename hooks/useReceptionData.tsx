"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  DataReceptionContextType,
  defaultReceptionData,
} from "@/types/reception";
import { TemplateType } from "@/types/discount-template";
import { clusters, Node } from "./paramCells";

export function useReceptionData(
  initial: Partial<DataReceptionContextType> = {}
) {
  const [data, setData] = useState<DataReceptionContextType>({
    ...defaultReceptionData,
    ...initial,
  });
  const [, setVersion] = useState(0);

  const liveClusters = useMemo(() => clusters, []);

  useEffect(() => {
    const unsubscribeFns: (() => void)[] = [];

    const nodes: Node[] = [
      liveClusters.price.node,
      liveClusters.grossWeight.node,
      liveClusters.tare.node,
      liveClusters.netWeight.node,

      liveClusters.Humedad.range,
      liveClusters.Humedad.percent,
      liveClusters.Humedad.tolerance,
      liveClusters.Humedad.penalty,

      liveClusters.GranosVerdes.range,
      liveClusters.GranosVerdes.percent,
      liveClusters.GranosVerdes.tolerance,
      liveClusters.GranosVerdes.penalty,

      liveClusters.Impurezas.range,
      liveClusters.Impurezas.percent,
      liveClusters.Impurezas.tolerance,
      liveClusters.Impurezas.penalty,

      liveClusters.Vano.range,
      liveClusters.Vano.percent,
      liveClusters.Vano.tolerance,
      liveClusters.Vano.penalty,

      liveClusters.Hualcacho.range,
      liveClusters.Hualcacho.percent,
      liveClusters.Hualcacho.tolerance,
      liveClusters.Hualcacho.penalty,

      liveClusters.GranosManchados.range,
      liveClusters.GranosManchados.percent,
      liveClusters.GranosManchados.tolerance,
      liveClusters.GranosManchados.penalty,

      liveClusters.GranosPelados.range,
      liveClusters.GranosPelados.percent,
      liveClusters.GranosPelados.tolerance,
      liveClusters.GranosPelados.penalty,

      liveClusters.GranosYesosos.range,
      liveClusters.GranosYesosos.percent,
      liveClusters.GranosYesosos.tolerance,
      liveClusters.GranosYesosos.penalty,

      liveClusters.Summary.percent,
      liveClusters.Summary.tolerance,
      liveClusters.Summary.penalty,

    ];

    nodes.forEach((node) => {
      // Store the original onChange function
      const originalOnChange = node.onChange;
      const wrappedOnChange = (value: number) => {
        setVersion((v) => v + 1);
        originalOnChange?.(value);
      };
      node.onChange = wrappedOnChange;

      unsubscribeFns.push(() => {
        node.onChange = originalOnChange;
      });

      // --- envolvemos setShow (no recibe parámetro) ---
      const originalSetShow = node.setShow;
      const wrappedSetShow = () => {
        setVersion((v) => v + 1);
        originalSetShow();
      };
      node.setShow = wrappedSetShow;
      unsubscribeFns.push(() => {
        node.setShow = originalSetShow;
      });
    });

    return () => {
      unsubscribeFns.forEach((fn) => fn());
    };
  }, [liveClusters]);

  const setTemplateField = useCallback(
    (field: keyof TemplateType, value: any) => {
      setData((prev) => ({
        ...prev,
        template: {
          ...prev.template,
          [field]: value,
        },
      }));
    },
    []
  );

  const setField = useCallback(
    (field: keyof DataReceptionContextType, value: any) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const setTemplate = useCallback((template: TemplateType) => {
    setData((prev) => ({
      ...prev,
      template,
    }));
  }, []);

  return {
    data,
    setField,
    setTemplateField,
    setTemplate,
    liveClusters,
  };
}
