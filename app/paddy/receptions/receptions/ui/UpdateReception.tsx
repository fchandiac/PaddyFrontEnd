// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   TextField,
//   InputAdornment,
//   CircularProgress,
//   Button,
// } from "@mui/material";
// import { useReceptionContext } from "@/context/ReceptionDataContext";
// import { getAllProducers } from "@/app/actions/producer";
// import { getAllRiceTypes } from "@/app/actions/rice-type";
// import GrainAnalysis from "../../new/ui/GrainAnalysis";
// import { Template } from "@/types/discount-template";
// import { useAlertContext } from "@/context/AlertContext";
// import { getReceptionByIdToLoad } from "@/app/actions/reception";
// import { FindReceptionByIdType } from "@/types/reception";

// interface UpdateReceptionProps {
//   receptionId: number;
// }

// export default function UpdateReception({ receptionId }: UpdateReceptionProps) {
//   const {
//     data,
//     // general setters
//     setProducerId,
//     setRiceTypeId,
//     setPrice,
//     setGuide,
//     setLicensePlate,
//     setGrossWeight,
//     setTare,
//     setNetWeight,
//     setNote,
//     // grain analysis setters
//     setPercentHumedad,
//     setToleranceHumedad,
//     setPercentGranosVerdes,
//     setToleranceGranosVerdes,
//     setPercentImpurezas,
//     setToleranceImpurezas,
//     setPercentVano,
//     setToleranceVano,
//     setPercentHualcacho,
//     setToleranceHualcacho,
//     setPercentGranosPelados,
//     setToleranceGranosPelados,
//     setPercentGranosYesosos,
//     setToleranceGranosYesosos,
//     setPercentGranosManchados,
//     setToleranceGranosManchados,
//     // bonus/drying
//     setToleranceBonificacion,
//     setPercentSecado,
//     // group
//     setUseToleranceGroup,
//     setToleranceGroupValue,
//     // reset inputs
//     setResetValueState,
//     // penalties
//     setTotalAnalysisPenalty,
//     setWeightBonificacion,
//     setTotalAnalysisPercent,
//     getToleranceGroup,
//     updateFieldNoCalc,
//   } = useReceptionContext();

//   const { showAlert } = useAlertContext();
//   const [  ['percentHumedad', reception.percentHumedad],
//   ['toleranceHumedad', reception.toleranceHumedad],
//   ['percentGranosVerdes', reception.percentGranosVerdes],
//   ['toleranceGranosVerdes', reception.toleranceGranosVerdes],
//   ['percentImpurezas', reception.percentImpurezas],
//   ['toleranceImpurezas', reception.toleranceImpurezas],
//   ['percentVano', reception.percentVano],
//   ['toleranceVano', reception.toleranceVano],
//   ['percentHualcacho', reception.percentHualcacho ?? 0],
//   ['toleranceHualcacho', reception.toleranceHualcacho],
//   ['percentGranosPelados', reception.percentGranosPelados],
//   ['toleranceGranosPelados', reception.toleranceGranosPelados],
//   ['percentGranosYesosos', reception.percentGranosYesosos],
//   ['toleranceGranosYesosos', reception.toleranceGranosYesosos],
//   ['percentGranosManchados', reception.percentGranosManchados],
//   ['toleranceGranosManchados', reception.toleranceGranosManchados],
//   ['toleranceBonificacion', reception.toleranceBonificacion],
//   ['percentSecado', reception.percentSecado],
// ].forEach(([field, value]) => updateFieldNoCalc(field as keyof typeof data, value));
//       } catch (err) {
//         console.error("Error loading reception:", err);
//         showAlert("Error al cargar datos de recepción.", "error");
//       } finally {
//         setLoading(false);
//         setTimeout(() => {
//           priceInputRef.current?.focus();
//           priceInputRef.current?.select();
//         }, 100);
//       }
//     }
//     load();
//   }, [receptionId]);

//   // Compute group tolerance once parameters loaded
//   useEffect(() => {
//     if (data.canLoadGroup) {
//       const group = getToleranceGroup();
//       const totalTol = group.reduce((sum, i) => sum + i.toleranceValue, 0);
//       setToleranceGroupValue(parseFloat(totalTol.toFixed(2)));
//       setComplete(true);
//     }
//   }, [data.canLoadGroup]);

//   const selectedProducer = producers.find(p => p.id === data.producerId);
//   const selectedRiceType = riceTypes.find(r => r.id === data.riceTypeId);

//   const handleBlurPrice = () => {
//     const n = parseInt(priceInput.replace(/\D/g, ""), 10);
//     if (!isNaN(n)) setPriceInput(
//       n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })
//     );
//   };

//   return (
//     <Box p={2}>
//       <Typography variant="h6" gutterBottom>
//         Actualizar Recepción Nº {receptionId}
//       </Typography>
//       <Grid container spacing={2}>
//         {/* 1. Datos generales */}
//         <Grid item xs={3}>
//           {loading ? (
//             <Box height={200} display="flex" justifyContent="center" alignItems="center">
//               <CircularProgress size={48} />
//             </Box>
//           ) : (
//             <Grid container spacing={1}>
//               {/* ... general TextFields here ... */}
//             </Grid>
//           )}
//         </Grid>

//         {/* 2. Análisis de granos */}
//         <Grid item xs={6}>
//           <GrainAnalysis
//             update={true}
//             loading={loading}
//             template={template!}
//           />
//         </Grid>

//         {/* 3. Resumen final */}
//         <Grid item xs={3}>
//           {/* ... summary and update button ... */}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
