# HorariosApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**scheduleControllerCreateException**](#schedulecontrollercreateexception) | **POST** /schedules/exceptions | Crear excepción de horario|
|[**scheduleControllerCreateSchedule**](#schedulecontrollercreateschedule) | **POST** /schedules | Crear horario recurrente|
|[**scheduleControllerFindAllExceptions**](#schedulecontrollerfindallexceptions) | **GET** /schedules/exceptions | Listar excepciones de horario|
|[**scheduleControllerFindAllSchedules**](#schedulecontrollerfindallschedules) | **GET** /schedules | Listar horarios recurrentes|
|[**scheduleControllerFindOneException**](#schedulecontrollerfindoneexception) | **GET** /schedules/exceptions/{id} | Obtener excepción por ID|
|[**scheduleControllerFindOneSchedule**](#schedulecontrollerfindoneschedule) | **GET** /schedules/{id} | Obtener horario por ID|
|[**scheduleControllerRemoveException**](#schedulecontrollerremoveexception) | **DELETE** /schedules/exceptions/{id} | Eliminar excepción de horario|
|[**scheduleControllerRemoveSchedule**](#schedulecontrollerremoveschedule) | **DELETE** /schedules/{id} | Eliminar horario recurrente|
|[**scheduleControllerUpdateException**](#schedulecontrollerupdateexception) | **PUT** /schedules/exceptions/{id} | Actualizar excepción de horario|
|[**scheduleControllerUpdateSchedule**](#schedulecontrollerupdateschedule) | **PUT** /schedules/{id} | Actualizar horario recurrente|

# **scheduleControllerCreateException**
> ScheduleExceptionResponseDto scheduleControllerCreateException(createScheduleExceptionDto)


### Example

```typescript
import {
    HorariosApi,
    Configuration,
    CreateScheduleExceptionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let createScheduleExceptionDto: CreateScheduleExceptionDto; //

const { status, data } = await apiInstance.scheduleControllerCreateException(
    createScheduleExceptionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createScheduleExceptionDto** | **CreateScheduleExceptionDto**|  | |


### Return type

**ScheduleExceptionResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **scheduleControllerCreateSchedule**
> ScheduleResponseDto scheduleControllerCreateSchedule(createScheduleDto)


### Example

```typescript
import {
    HorariosApi,
    Configuration,
    CreateScheduleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let createScheduleDto: CreateScheduleDto; //

const { status, data } = await apiInstance.scheduleControllerCreateSchedule(
    createScheduleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createScheduleDto** | **CreateScheduleDto**|  | |


### Return type

**ScheduleResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **scheduleControllerFindAllExceptions**
> Array<ScheduleExceptionResponseDto> scheduleControllerFindAllExceptions()


### Example

```typescript
import {
    HorariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let employeeId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.scheduleControllerFindAllExceptions(
    employeeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employeeId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**Array<ScheduleExceptionResponseDto>**

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

# **scheduleControllerFindAllSchedules**
> Array<ScheduleResponseDto> scheduleControllerFindAllSchedules()


### Example

```typescript
import {
    HorariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let employeeId: number; // (optional) (default to undefined)
let branchId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.scheduleControllerFindAllSchedules(
    employeeId,
    branchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employeeId** | [**number**] |  | (optional) defaults to undefined|
| **branchId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**Array<ScheduleResponseDto>**

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

# **scheduleControllerFindOneException**
> ScheduleExceptionResponseDto scheduleControllerFindOneException()


### Example

```typescript
import {
    HorariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.scheduleControllerFindOneException(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ScheduleExceptionResponseDto**

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

# **scheduleControllerFindOneSchedule**
> ScheduleResponseDto scheduleControllerFindOneSchedule()


### Example

```typescript
import {
    HorariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.scheduleControllerFindOneSchedule(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ScheduleResponseDto**

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

# **scheduleControllerRemoveException**
> scheduleControllerRemoveException()


### Example

```typescript
import {
    HorariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.scheduleControllerRemoveException(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Excepción eliminada |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **scheduleControllerRemoveSchedule**
> scheduleControllerRemoveSchedule()


### Example

```typescript
import {
    HorariosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.scheduleControllerRemoveSchedule(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Horario eliminado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **scheduleControllerUpdateException**
> ScheduleExceptionResponseDto scheduleControllerUpdateException(updateScheduleExceptionDto)


### Example

```typescript
import {
    HorariosApi,
    Configuration,
    UpdateScheduleExceptionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let id: number; // (default to undefined)
let updateScheduleExceptionDto: UpdateScheduleExceptionDto; //

const { status, data } = await apiInstance.scheduleControllerUpdateException(
    id,
    updateScheduleExceptionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateScheduleExceptionDto** | **UpdateScheduleExceptionDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ScheduleExceptionResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **scheduleControllerUpdateSchedule**
> ScheduleResponseDto scheduleControllerUpdateSchedule(updateScheduleDto)


### Example

```typescript
import {
    HorariosApi,
    Configuration,
    UpdateScheduleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new HorariosApi(configuration);

let id: number; // (default to undefined)
let updateScheduleDto: UpdateScheduleDto; //

const { status, data } = await apiInstance.scheduleControllerUpdateSchedule(
    id,
    updateScheduleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateScheduleDto** | **UpdateScheduleDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ScheduleResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

