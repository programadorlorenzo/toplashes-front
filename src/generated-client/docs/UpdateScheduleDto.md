# UpdateScheduleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**employeeId** | **number** | ID de la colaboradora | [optional] [default to undefined]
**branchId** | **number** | ID de la sucursal | [optional] [default to undefined]
**dayOfWeek** | **number** | Día de la semana (0-6) | [optional] [default to undefined]
**startTime** | **string** | Hora de inicio (HH:mm) | [optional] [default to undefined]
**endTime** | **string** | Hora de fin (HH:mm) | [optional] [default to undefined]

## Example

```typescript
import { UpdateScheduleDto } from './api';

const instance: UpdateScheduleDto = {
    employeeId,
    branchId,
    dayOfWeek,
    startTime,
    endTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
