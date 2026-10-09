# CreateScheduleExceptionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**employeeId** | **number** | ID de la colaboradora | [default to undefined]
**date** | **string** | Fecha (YYYY-MM-DD) | [default to undefined]
**type** | **string** |  | [default to undefined]
**startTime** | **string** | Hora de inicio (HH:mm) | [optional] [default to undefined]
**endTime** | **string** | Hora de fin (HH:mm) | [optional] [default to undefined]
**reason** | **string** | Motivo | [optional] [default to undefined]

## Example

```typescript
import { CreateScheduleExceptionDto } from './api';

const instance: CreateScheduleExceptionDto = {
    employeeId,
    date,
    type,
    startTime,
    endTime,
    reason,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
