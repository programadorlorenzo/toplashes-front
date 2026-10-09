# CreateRoleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre del rol | [default to undefined]
**description** | **string** | Descripción del rol | [optional] [default to undefined]
**permissionIds** | **Array&lt;number&gt;** | IDs de permisos a asignar | [optional] [default to undefined]

## Example

```typescript
import { CreateRoleDto } from './api';

const instance: CreateRoleDto = {
    name,
    description,
    permissionIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
