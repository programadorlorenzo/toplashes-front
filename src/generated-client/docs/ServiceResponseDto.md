# ServiceResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**categoryId** | **number** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**price** | **number** |  | [default to undefined]
**duration** | **number** |  | [default to undefined]
**prepTime** | **number** |  | [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**allowConcurrent** | **boolean** |  | [optional] [default to undefined]
**branchAssignments** | [**Array&lt;ServiceBranchAssignmentResponseDto&gt;**](ServiceBranchAssignmentResponseDto.md) |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]

## Example

```typescript
import { ServiceResponseDto } from './api';

const instance: ServiceResponseDto = {
    id,
    name,
    categoryId,
    description,
    price,
    duration,
    prepTime,
    isActive,
    allowConcurrent,
    branchAssignments,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
