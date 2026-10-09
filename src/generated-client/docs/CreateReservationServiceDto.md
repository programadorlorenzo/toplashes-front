# CreateReservationServiceDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**serviceId** | **number** | ID del servicio | [default to undefined]
**employeeId** | **number** | ID de la colaboradora (null para asignar después) | [optional] [default to undefined]
**startTime** | **string** | Inicio del servicio (ISO 8601) | [default to undefined]
**agreedPrice** | **number** | Precio acordado (si difiere del catálogo) | [optional] [default to undefined]

## Example

```typescript
import { CreateReservationServiceDto } from './api';

const instance: CreateReservationServiceDto = {
    serviceId,
    employeeId,
    startTime,
    agreedPrice,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
