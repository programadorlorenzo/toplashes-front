# DisponibilidadApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**availabilityControllerGetAvailableSlots**](#availabilitycontrollergetavailableslots) | **GET** /availability | Consultar slots disponibles para un servicio|

# **availabilityControllerGetAvailableSlots**
> Array<AvailableSlotResponseDto> availabilityControllerGetAvailableSlots()


### Example

```typescript
import {
    DisponibilidadApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DisponibilidadApi(configuration);

let branchId: number; //ID de la sucursal (default to undefined)
let serviceId: number; //ID del servicio (default to undefined)
let date: string; //Fecha (YYYY-MM-DD) (default to undefined)
let employeeId: number; //Filtrar por colaboradora (optional) (default to undefined)

const { status, data } = await apiInstance.availabilityControllerGetAvailableSlots(
    branchId,
    serviceId,
    date,
    employeeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchId** | [**number**] | ID de la sucursal | defaults to undefined|
| **serviceId** | [**number**] | ID del servicio | defaults to undefined|
| **date** | [**string**] | Fecha (YYYY-MM-DD) | defaults to undefined|
| **employeeId** | [**number**] | Filtrar por colaboradora | (optional) defaults to undefined|


### Return type

**Array<AvailableSlotResponseDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

