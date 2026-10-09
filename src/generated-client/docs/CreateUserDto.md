# CreateUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | Correo electrónico | [default to undefined]
**password** | **string** | Contraseña | [default to undefined]
**name** | **string** | Nombre completo | [default to undefined]
**roleId** | **number** | ID del rol a asignar | [default to undefined]
**branchIds** | **Array&lt;number&gt;** | IDs de sucursales asignadas | [optional] [default to undefined]

## Example

```typescript
import { CreateUserDto } from './api';

const instance: CreateUserDto = {
    email,
    password,
    name,
    roleId,
    branchIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
