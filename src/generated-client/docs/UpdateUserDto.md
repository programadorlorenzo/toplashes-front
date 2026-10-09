# UpdateUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | Correo electrónico | [optional] [default to undefined]
**password** | **string** | Contraseña nueva | [optional] [default to undefined]
**name** | **string** | Nombre completo | [optional] [default to undefined]
**roleId** | **number** | ID del rol | [optional] [default to undefined]
**isActive** | **boolean** | Si el usuario está activo | [optional] [default to undefined]
**branchIds** | **Array&lt;number&gt;** | IDs de sucursales asignadas | [optional] [default to undefined]

## Example

```typescript
import { UpdateUserDto } from './api';

const instance: UpdateUserDto = {
    email,
    password,
    name,
    roleId,
    isActive,
    branchIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
