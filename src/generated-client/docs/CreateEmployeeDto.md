# CreateEmployeeDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstName** | **string** | Nombres | [default to undefined]
**lastName** | **string** | Apellidos | [default to undefined]
**phone** | **string** | Teléfono | [optional] [default to undefined]
**isActive** | **boolean** | Si está activa | [optional] [default to true]
**userId** | **number** | ID de usuario del sistema | [optional] [default to undefined]
**branchIds** | **Array&lt;number&gt;** | IDs de sucursales asignadas | [optional] [default to undefined]
**serviceIds** | **Array&lt;number&gt;** | IDs de servicios que realiza | [optional] [default to undefined]

## Example

```typescript
import { CreateEmployeeDto } from './api';

const instance: CreateEmployeeDto = {
    firstName,
    lastName,
    phone,
    isActive,
    userId,
    branchIds,
    serviceIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
