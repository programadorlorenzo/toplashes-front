# UserResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**email** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**roleId** | **number** |  | [default to undefined]
**roleName** | **string** |  | [default to undefined]
**employeeId** | **number** |  | [optional] [default to undefined]
**branches** | [**Array&lt;UserBranchResponseDto&gt;**](UserBranchResponseDto.md) |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]

## Example

```typescript
import { UserResponseDto } from './api';

const instance: UserResponseDto = {
    id,
    email,
    name,
    isActive,
    roleId,
    roleName,
    employeeId,
    branches,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
