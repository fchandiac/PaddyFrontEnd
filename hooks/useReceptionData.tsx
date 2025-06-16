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

      liveClusters.Bonus.tolerance,
      liveClusters.Bonus.penalty,

      liveClusters.Dry.percent,
  

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

  // Sincroniza la visibilidad de los nodos con los flags availableX del template
  useEffect(() => {
    console.log('🔥 useEffect triggered - sincronizando visibilidad');
    console.log('🔥 Current data.template:', data?.template);
    
    if (!data?.template) {
      console.log('🔥 No template loaded - showing all fields');
      // Si no hay plantilla, mostrar todos los campos
      const allParamClusters = [
        liveClusters.Humedad,
        liveClusters.GranosVerdes,
        liveClusters.Impurezas,
        liveClusters.Vano,
        liveClusters.Hualcacho,
        liveClusters.GranosManchados,
        liveClusters.GranosPelados,
        liveClusters.GranosYesosos,
      ];
      allParamClusters.forEach((cluster) => {
        cluster.range.show = true;
        cluster.percent.show = true;
        cluster.tolerance.show = true;
        cluster.penalty.show = true;
      });
      liveClusters.Bonus.tolerance.show = true;
      liveClusters.Bonus.penalty.show = true;
      liveClusters.Dry.percent.show = true;
      console.log('🔥 All fields set to visible');
      
      // Restaurar colores predeterminados del GroupSummary cuando no hay plantilla
      liveClusters.groupSummary.percent.backgroundColor = "inherit";
      liveClusters.groupSummary.tolerance.backgroundColor = "inherit";
      liveClusters.groupSummary.penalty.backgroundColor = "inherit";
      
      return;
    }
    
    console.log('🔥 Template loaded:', data.template.name);
    console.log('🔥 Template data:', data.template);
    
    // ParamClusters
    const paramMapping = [
      { available: data.template.availableHumedad, cluster: liveClusters.Humedad, name: 'Humedad', groupTolerance: data.template.groupToleranceHumedad },
      { available: data.template.availableGranosVerdes, cluster: liveClusters.GranosVerdes, name: 'GranosVerdes', groupTolerance: data.template.groupToleranceGranosVerdes },
      { available: data.template.availableImpurezas, cluster: liveClusters.Impurezas, name: 'Impurezas', groupTolerance: data.template.groupToleranceImpurezas },
      { available: data.template.availableVano, cluster: liveClusters.Vano, name: 'Vano', groupTolerance: data.template.groupToleranceVano },
      { available: data.template.availableHualcacho, cluster: liveClusters.Hualcacho, name: 'Hualcacho', groupTolerance: data.template.groupToleranceHualcacho },
      { available: data.template.availableGranosManchados, cluster: liveClusters.GranosManchados, name: 'GranosManchados', groupTolerance: data.template.groupToleranceGranosManchados },
      { available: data.template.availableGranosPelados, cluster: liveClusters.GranosPelados, name: 'GranosPelados', groupTolerance: data.template.groupToleranceGranosPelados },
      { available: data.template.availableGranosYesosos, cluster: liveClusters.GranosYesosos, name: 'GranosYesosos', groupTolerance: data.template.groupToleranceGranosYesosos },
    ];
    paramMapping.forEach(({ available, cluster, name, groupTolerance }) => {
      console.log(`🔥 Setting ${name} visibility to:`, available);
      cluster.range.show = !!available;
      cluster.percent.show = !!available;
      cluster.tolerance.show = !!available;
      cluster.penalty.show = !!available;
      
      // Actualizar flag de toleranceGroup en el clúster
      cluster.toleranceGroup = !!(data.template.useToleranceGroup && groupTolerance);
      cluster.available = !!available;
      
      // Establecer color de fondo para elementos que pertenecen al grupo de tolerancia
      if (data.template.useToleranceGroup && groupTolerance && available) {
        console.log(`🔥 Setting ${name} group tolerance background color`);
        // Color morado pastel claro para elementos del grupo de tolerancia
        cluster.range.backgroundColor = "#ede7f6"; // Morado pastel claro para range también
        cluster.tolerance.backgroundColor = "#ede7f6"; // Morado pastel claro
        cluster.percent.backgroundColor = "#ede7f6"; // Morado pastel claro
        cluster.penalty.backgroundColor = "#ede7f6"; // Morado pastel claro para penalty también
      } else {
        // Restaurar color predeterminado solo si no hay error
        if (!cluster.range.error) {
          cluster.range.backgroundColor = "inherit";
        }
        if (!cluster.tolerance.error) {
          cluster.tolerance.backgroundColor = "inherit";
        }
        if (!cluster.percent.error) {
          cluster.percent.backgroundColor = "inherit";
        }
        if (!cluster.penalty.error) {
          cluster.penalty.backgroundColor = "inherit";
        }
      }
    });
    // BonusCluster
    console.log('🔥 Setting Bonus visibility to:', data.template.availableBonus);
    liveClusters.Bonus.tolerance.show = !!data.template.availableBonus;
    liveClusters.Bonus.penalty.show = !!data.template.availableBonus;
    
    // GroupSummary - aplicar estilo si se usa tolerancia de grupo
    const hasGroupToleranceParams = data.template.useToleranceGroup && paramMapping.some(
      item => item.available && item.groupTolerance
    );
    
    if (data.template.useToleranceGroup && hasGroupToleranceParams) {
      console.log('🔥 Setting GroupSummary background color for tolerance group');
      liveClusters.groupSummary.toleranceGroup = true; // Marcar como parte del grupo de tolerancia
      liveClusters.groupSummary.percent.backgroundColor = "#ede7f6";
      liveClusters.groupSummary.tolerance.backgroundColor = "#ede7f6";
      liveClusters.groupSummary.penalty.backgroundColor = "#ede7f6";
    } else {
      liveClusters.groupSummary.toleranceGroup = false; // No pertenece al grupo de tolerancia
      liveClusters.groupSummary.percent.backgroundColor = "inherit";
      liveClusters.groupSummary.tolerance.backgroundColor = "inherit";
      liveClusters.groupSummary.penalty.backgroundColor = "inherit";
    }
    
    // DryCluster
    console.log('🔥 Setting Dry visibility to:', data.template.availableDry);
    liveClusters.Dry.percent.show = !!data.template.availableDry;
    
    // Después de actualizar todos los parámetros, forzar recálculo del porcentaje en groupSummary
    console.log('🔥 Forcing recalculation of groupSummary values');
    if (liveClusters.groupSummary.percent.effect) {
      liveClusters.groupSummary.percent.effect();
    }
    
    // Forzar recálculo de la tolerancia del grupo
    if (liveClusters.groupSummary.tolerance.effect) {
      liveClusters.groupSummary.tolerance.effect();
    }
    
    // Forzar recálculo de la penalización del grupo
    if (liveClusters.groupSummary.penalty.effect) {
      liveClusters.groupSummary.penalty.effect();
    }
    
    // Restablecer el comportamiento del onChange de la tolerancia del grupo
    // para asegurar que se distribuya correctamente a los parámetros individuales
    const originalToleranceOnChange = liveClusters.groupSummary.tolerance.onChange;
    liveClusters.groupSummary.tolerance.onChange = (value: number) => {
      setVersion((v) => v + 1); // Actualizar versión para forzar re-render
      originalToleranceOnChange(value);
    };
    
    console.log('🔥 Template visibility sync completed');
  }, [data?.template, liveClusters]);

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

  // Modifica setTemplate para aplicar correctamente la plantilla
  const setTemplate = useCallback((template: TemplateType) => {
    console.log('🔥 setTemplate called with:', template);
    console.log('🔥 Template name:', template.name);
    console.log('🔥 Template available fields:', {
      Humedad: template.availableHumedad,
      GranosVerdes: template.availableGranosVerdes,
      Impurezas: template.availableImpurezas,
      Vano: template.availableVano,
      Hualcacho: template.availableHualcacho,
      GranosManchados: template.availableGranosManchados,
      GranosPelados: template.availableGranosPelados,
      GranosYesosos: template.availableGranosYesosos,
      Bonus: template.availableBonus,
      Dry: template.availableDry,
    });
    
    setData((prev) => ({
      ...prev,
      template,
    }));
    console.log('🔥 Template set in data state');
  }, []);

  const updateToleranceGroupMode = useCallback(
    (useToleranceGroup: boolean) => {
      console.log('🔥 Updating tolerance group mode to:', useToleranceGroup);
      
      setData((prev) => ({
        ...prev,
        template: {
          ...prev.template,
          useToleranceGroup
        },
      }));
      
      // Actualizar el estado de los clusters según el nuevo modo
      const paramClusters = [
        liveClusters.Humedad,
        liveClusters.GranosVerdes,
        liveClusters.Impurezas,
        liveClusters.Vano,
        liveClusters.Hualcacho,
        liveClusters.GranosManchados,
        liveClusters.GranosPelados,
        liveClusters.GranosYesosos
      ];
      
      // Actualizar la propiedad toleranceGroup en cada cluster
      paramClusters.forEach(cluster => {
        if (cluster.available) {
          // Solo actualizamos si el cluster está disponible
          const groupToleranceField = `groupTolerance${cluster.key}` as keyof TemplateType;
          const groupTolerance = data.template[groupToleranceField];
          
          cluster.toleranceGroup = !!(useToleranceGroup && groupTolerance);
          
          // Actualizar colores de fondo según corresponda
          if (useToleranceGroup && groupTolerance) {
            cluster.range.backgroundColor = "#ede7f6";
            cluster.tolerance.backgroundColor = "#ede7f6";
            cluster.percent.backgroundColor = "#ede7f6";
            cluster.penalty.backgroundColor = "#ede7f6";
          } else {
            // Restaurar colores predeterminados si no hay error
            if (!cluster.range.error) {
              cluster.range.backgroundColor = "inherit";
            }
            if (!cluster.tolerance.error) {
              cluster.tolerance.backgroundColor = "inherit";
            }
            if (!cluster.percent.error) {
              cluster.percent.backgroundColor = "inherit";
            }
            if (!cluster.penalty.error) {
              cluster.penalty.backgroundColor = "inherit";
            }
          }
        }
      });
      
      // Actualizar el color de fondo del groupSummary
      if (useToleranceGroup && paramClusters.some(c => c.available && c.toleranceGroup)) {
        liveClusters.groupSummary.percent.backgroundColor = "#ede7f6";
        liveClusters.groupSummary.tolerance.backgroundColor = "#ede7f6";
        liveClusters.groupSummary.penalty.backgroundColor = "#ede7f6";
      } else {
        liveClusters.groupSummary.percent.backgroundColor = "inherit";
        liveClusters.groupSummary.tolerance.backgroundColor = "inherit";
        liveClusters.groupSummary.penalty.backgroundColor = "inherit";
      }
      
      // Forzar recálculo de todos los valores relacionados con el grupo de tolerancia
      if (liveClusters.groupSummary.percent.effect) {
        liveClusters.groupSummary.percent.effect();
      }
      
      if (liveClusters.groupSummary.tolerance.effect) {
        liveClusters.groupSummary.tolerance.effect();
      }
      
      if (liveClusters.groupSummary.penalty.effect) {
        liveClusters.groupSummary.penalty.effect();
      }
    },
    [liveClusters, data.template]
  );

  return {
    data,
    setField,
    setTemplateField,
    setTemplate,
    liveClusters,
    updateToleranceGroupMode,
  };
}
