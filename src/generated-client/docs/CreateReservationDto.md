# CreateReservationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**customerId** | **number** | ID del cliente | [default to undefined]
**branchId** | **number** | ID de la sucursal | [default to undefined]
**date** | **string** | Fecha de la reserva (YYYY-MM-DD) | [default to undefined]
**channel** | **string** |  | [default to undefined]
**notes** | **string** | Notas | [optional] [default to undefined]
**discount** | **number** | Descuento | [optional] [default to 0]
**services** | [**Array&lt;CreateReservationServiceDto&gt;**](CreateReservationServiceDto.md) |  | [default to undefined]

## Example

```typescript
import { CreateReservationDto } from './api';

const instance: CreateReservationDto = {
    customerId,
    branchId,
    date,
    channel,
    notes,
    discount,
    services,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
