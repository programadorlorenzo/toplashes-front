# WeeklyStatsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dailyRevenue** | [**Array&lt;DayRevenueDto&gt;**](DayRevenueDto.md) |  | [default to undefined]
**reservationsByStatus** | [**Array&lt;StatusCountDto&gt;**](StatusCountDto.md) |  | [default to undefined]
**reservationsByHour** | [**Array&lt;HourCountDto&gt;**](HourCountDto.md) |  | [default to undefined]
**employeeProductivity** | [**Array&lt;EmployeeProductivityDto&gt;**](EmployeeProductivityDto.md) |  | [default to undefined]
**dailyReservationTrend** | [**Array&lt;DayReservationCountDto&gt;**](DayReservationCountDto.md) |  | [default to undefined]
**topServices** | [**Array&lt;TopServiceStatDto&gt;**](TopServiceStatDto.md) |  | [default to undefined]
**averageServiceTime** | **object** | Tiempo promedio de atención (minutos) | [optional] [default to undefined]
**estimateVsActualDiff** | **object** | Diferencia promedio estimado vs. real (minutos) | [optional] [default to undefined]

## Example

```typescript
import { WeeklyStatsResponseDto } from './api';

const instance: WeeklyStatsResponseDto = {
    dailyRevenue,
    reservationsByStatus,
    reservationsByHour,
    employeeProductivity,
    dailyReservationTrend,
    topServices,
    averageServiceTime,
    estimateVsActualDiff,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
