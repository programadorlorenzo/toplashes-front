# DailyStatsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reservationsToday** | **number** |  | [default to undefined]
**confirmedReservations** | **number** |  | [default to undefined]
**inServiceCount** | **number** |  | [default to undefined]
**completedCount** | **number** |  | [default to undefined]
**cancelledCount** | **number** |  | [default to undefined]
**noShowCount** | **number** |  | [default to undefined]
**employeesAvailable** | **number** |  | [default to undefined]
**employeesOccupied** | **number** |  | [default to undefined]
**totalPaymentsReceived** | **string** | Total cobrado (pagos no reembolso) del día | [default to undefined]
**pendingBalance** | **string** | Suma de saldos pendientes de reservas del día | [default to undefined]
**topServices** | [**Array&lt;TopServiceStatDto&gt;**](TopServiceStatDto.md) |  | [default to undefined]
**averageServiceTime** | **object** | Tiempo promedio de atención en minutos (atenciones completadas) | [default to undefined]
**estimateVsActualDiff** | **object** | Diferencia promedio (minutos) entre duración real y estimada en atenciones completadas | [default to undefined]

## Example

```typescript
import { DailyStatsResponseDto } from './api';

const instance: DailyStatsResponseDto = {
    reservationsToday,
    confirmedReservations,
    inServiceCount,
    completedCount,
    cancelledCount,
    noShowCount,
    employeesAvailable,
    employeesOccupied,
    totalPaymentsReceived,
    pendingBalance,
    topServices,
    averageServiceTime,
    estimateVsActualDiff,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
