# ReservationBalanceResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalAmount** | **string** | Monto total de la reserva (con descuento aplicado) | [default to undefined]
**discount** | **string** | Descuento registrado en la reserva | [default to undefined]
**totalPaid** | **string** | Total pagado neto (pagos menos devoluciones) | [default to undefined]
**balance** | **string** | Saldo pendiente | [default to undefined]

## Example

```typescript
import { ReservationBalanceResponseDto } from './api';

const instance: ReservationBalanceResponseDto = {
    totalAmount,
    discount,
    totalPaid,
    balance,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
