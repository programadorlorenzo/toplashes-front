# CreateScheduleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**employeeId** | **number** | ID de la colaboradora | [default to undefined]
**branchId** | **number** | ID de la sucursal | [default to undefined]
**dayOfWeek** | **number** | Día de la semana (0-6) | [default to undefined]
**startTime** | **string** | Hora de inicio (HH:mm) | [optional] [default to '09:00']
**endTime** | **string** | Hora de fin (HH:mm) | [optional] [default to '18:00']

## Example

```typescript
import { CreateScheduleDto } from './api';

const instance: CreateScheduleDto = {
    employeeId,
    branchId,
    dayOfWeek,
    startTime,
    endTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
