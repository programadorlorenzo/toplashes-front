# EmployeeResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**firstName** | **string** |  | [default to undefined]
**lastName** | **string** |  | [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**color** | **string** | Color hexadecimal | [optional] [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**userId** | **number** |  | [optional] [default to undefined]
**branchIds** | **Array&lt;number&gt;** | Sucursales asignadas | [default to undefined]
**serviceIds** | **Array&lt;number&gt;** | Servicios asignados | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]

## Example

```typescript
import { EmployeeResponseDto } from './api';

const instance: EmployeeResponseDto = {
    id,
    firstName,
    lastName,
    phone,
    color,
    isActive,
    userId,
    branchIds,
    serviceIds,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
