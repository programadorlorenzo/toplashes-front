# CreatePaymentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reservationId** | **number** | ID de la reserva | [default to undefined]
**amount** | **number** | Monto | [default to undefined]
**method** | **string** |  | [default to undefined]
**type** | **string** |  | [default to undefined]
**reference** | **string** | Referencia de transacción | [optional] [default to undefined]
**notes** | **string** | Notas | [optional] [default to undefined]
**idempotencyKey** | **string** | Clave de idempotencia para evitar duplicados | [optional] [default to undefined]

## Example

```typescript
import { CreatePaymentDto } from './api';

const instance: CreatePaymentDto = {
    reservationId,
    amount,
    method,
    type,
    reference,
    notes,
    idempotencyKey,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
