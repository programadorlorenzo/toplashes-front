# UpdateCustomerDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstName** | **string** | Nombres | [optional] [default to undefined]
**lastName** | **string** | Apellidos | [optional] [default to undefined]
**whatsapp** | **string** | WhatsApp | [optional] [default to undefined]
**phone** | **string** | Teléfono alternativo | [optional] [default to undefined]
**email** | **string** | Correo electrónico | [optional] [default to undefined]
**notes** | **string** | Notas | [optional] [default to undefined]
**noShowCount** | **number** | Contador de inasistencias | [optional] [default to undefined]

## Example

```typescript
import { UpdateCustomerDto } from './api';

const instance: UpdateCustomerDto = {
    firstName,
    lastName,
    whatsapp,
    phone,
    email,
    notes,
    noShowCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
