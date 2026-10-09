# DashboardApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**dashboardControllerGetDailyStats**](#dashboardcontrollergetdailystats) | **GET** /dashboard/daily | Estadísticas operativas del día por sucursal|

# **dashboardControllerGetDailyStats**
> DailyStatsResponseDto dashboardControllerGetDailyStats()


### Example

```typescript
import {
    DashboardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardApi(configuration);

let branchId: number; // (default to undefined)
let date: string; //YYYY-MM-DD (default to undefined)

const { status, data } = await apiInstance.dashboardControllerGetDailyStats(
    branchId,
    date
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchId** | [**number**] |  | defaults to undefined|
| **date** | [**string**] | YYYY-MM-DD | defaults to undefined|


### Return type

**DailyStatsResponseDto**

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

