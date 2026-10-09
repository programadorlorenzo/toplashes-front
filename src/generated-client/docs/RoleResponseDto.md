# RoleResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**isSystem** | **boolean** |  | [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**permissions** | [**Array&lt;PermissionResponseDto&gt;**](PermissionResponseDto.md) |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]

## Example

```typescript
import { RoleResponseDto } from './api';

const instance: RoleResponseDto = {
    id,
    name,
    description,
    isSystem,
    isActive,
    permissions,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
