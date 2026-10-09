# CreateBranchDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre de la sucursal | [default to undefined]
**address** | **string** | Dirección | [default to undefined]
**phone** | **string** | Teléfono de contacto | [optional] [default to undefined]
**isActive** | **boolean** | Si la sucursal está activa | [optional] [default to true]
**openTime** | **string** | Hora de apertura (HH:mm) | [optional] [default to undefined]
**closeTime** | **string** | Hora de cierre (HH:mm) | [optional] [default to undefined]
**workDays** | **Array&lt;number&gt;** | Días laborables (0&#x3D;domingo … 6&#x3D;sábado) | [optional] [default to undefined]

## Example

```typescript
import { CreateBranchDto } from './api';

const instance: CreateBranchDto = {
    name,
    address,
    phone,
    isActive,
    openTime,
    closeTime,
    workDays,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
