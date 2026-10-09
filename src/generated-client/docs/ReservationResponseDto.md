# ReservationResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**customerId** | **number** |  | [default to undefined]
**branchId** | **number** |  | [default to undefined]
**date** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**channel** | **string** |  | [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**createdById** | **number** |  | [default to undefined]
**totalAmount** | **string** |  | [default to undefined]
**discount** | **string** |  | [default to undefined]
**services** | [**Array&lt;ReservationServiceResponseDto&gt;**](ReservationServiceResponseDto.md) |  | [default to undefined]
**statusHistory** | [**Array&lt;ReservationStatusHistoryResponseDto&gt;**](ReservationStatusHistoryResponseDto.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]

## Example

```typescript
import { ReservationResponseDto } from './api';

const instance: ReservationResponseDto = {
    id,
    customerId,
    branchId,
    date,
    status,
    channel,
    notes,
    createdById,
    totalAmount,
    discount,
    services,
    statusHistory,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
