# ReservasApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**reservationControllerAssignServiceLineEmployee**](#reservationcontrollerassignservicelineemployee) | **PUT** /reservations/services/{lineId}/assign | Asignar o reasignar colaboradora a una línea|
|[**reservationControllerCancel**](#reservationcontrollercancel) | **POST** /reservations/{id}/cancel | Cancelar reserva|
|[**reservationControllerCreate**](#reservationcontrollercreate) | **POST** /reservations | Crear reserva|
|[**reservationControllerFindAll**](#reservationcontrollerfindall) | **GET** /reservations | Listar reservas|
|[**reservationControllerFindOne**](#reservationcontrollerfindone) | **GET** /reservations/{id} | Obtener reserva por ID|
|[**reservationControllerFinishServiceLine**](#reservationcontrollerfinishserviceline) | **POST** /reservations/services/{lineId}/finish | Finalizar atención de una línea de servicio|
|[**reservationControllerStartServiceLine**](#reservationcontrollerstartserviceline) | **POST** /reservations/services/{lineId}/start | Iniciar atención de una línea de servicio|
|[**reservationControllerSyncCalendar**](#reservationcontrollersynccalendar) | **POST** /reservations/{id}/sync-calendar | Sincronizar reserva con Google Calendar|
|[**reservationControllerUpdate**](#reservationcontrollerupdate) | **PUT** /reservations/{id} | Actualizar reserva|
|[**reservationControllerUpdateServiceLineEstimate**](#reservationcontrollerupdateservicelineestimate) | **PUT** /reservations/services/{lineId}/estimate | Actualizar fin estimado de una línea de servicio|
|[**reservationControllerUpdateStatus**](#reservationcontrollerupdatestatus) | **PUT** /reservations/{id}/status | Actualizar estado de la reserva|

# **reservationControllerAssignServiceLineEmployee**
> ReservationResponseDto reservationControllerAssignServiceLineEmployee(assignServiceLineEmployeeDto)


### Example

```typescript
import {
    ReservasApi,
    Configuration,
    AssignServiceLineEmployeeDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let lineId: number; // (default to undefined)
let assignServiceLineEmployeeDto: AssignServiceLineEmployeeDto; //

const { status, data } = await apiInstance.reservationControllerAssignServiceLineEmployee(
    lineId,
    assignServiceLineEmployeeDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignServiceLineEmployeeDto** | **AssignServiceLineEmployeeDto**|  | |
| **lineId** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

# **reservationControllerCancel**
> ReservationResponseDto reservationControllerCancel(cancelReservationDto)


### Example

```typescript
import {
    ReservasApi,
    Configuration,
    CancelReservationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let id: number; // (default to undefined)
let cancelReservationDto: CancelReservationDto; //

const { status, data } = await apiInstance.reservationControllerCancel(
    id,
    cancelReservationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cancelReservationDto** | **CancelReservationDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

# **reservationControllerCreate**
> ReservationResponseDto reservationControllerCreate(createReservationDto)


### Example

```typescript
import {
    ReservasApi,
    Configuration,
    CreateReservationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let createReservationDto: CreateReservationDto; //

const { status, data } = await apiInstance.reservationControllerCreate(
    createReservationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createReservationDto** | **CreateReservationDto**|  | |


### Return type

**ReservationResponseDto**

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

# **reservationControllerFindAll**
> Array<ReservationResponseDto> reservationControllerFindAll()


### Example

```typescript
import {
    ReservasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let branchId: number; // (optional) (default to undefined)
let date: string; //YYYY-MM-DD (optional) (default to undefined)
let status: 'pending_confirmation' | 'confirmed' | 'client_present' | 'in_service' | 'completed' | 'cancelled' | 'no_show'; // (optional) (default to undefined)
let customerId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.reservationControllerFindAll(
    branchId,
    date,
    status,
    customerId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchId** | [**number**] |  | (optional) defaults to undefined|
| **date** | [**string**] | YYYY-MM-DD | (optional) defaults to undefined|
| **status** | [**&#39;pending_confirmation&#39; | &#39;confirmed&#39; | &#39;client_present&#39; | &#39;in_service&#39; | &#39;completed&#39; | &#39;cancelled&#39; | &#39;no_show&#39;**]**Array<&#39;pending_confirmation&#39; &#124; &#39;confirmed&#39; &#124; &#39;client_present&#39; &#124; &#39;in_service&#39; &#124; &#39;completed&#39; &#124; &#39;cancelled&#39; &#124; &#39;no_show&#39;>** |  | (optional) defaults to undefined|
| **customerId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**Array<ReservationResponseDto>**

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

# **reservationControllerFindOne**
> ReservationResponseDto reservationControllerFindOne()


### Example

```typescript
import {
    ReservasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.reservationControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

# **reservationControllerFinishServiceLine**
> ReservationResponseDto reservationControllerFinishServiceLine(finishServiceLineDto)


### Example

```typescript
import {
    ReservasApi,
    Configuration,
    FinishServiceLineDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let lineId: number; // (default to undefined)
let finishServiceLineDto: FinishServiceLineDto; //

const { status, data } = await apiInstance.reservationControllerFinishServiceLine(
    lineId,
    finishServiceLineDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **finishServiceLineDto** | **FinishServiceLineDto**|  | |
| **lineId** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

# **reservationControllerStartServiceLine**
> ReservationResponseDto reservationControllerStartServiceLine()


### Example

```typescript
import {
    ReservasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let lineId: number; // (default to undefined)

const { status, data } = await apiInstance.reservationControllerStartServiceLine(
    lineId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lineId** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

# **reservationControllerSyncCalendar**
> SyncCalendarResponseDto reservationControllerSyncCalendar()


### Example

```typescript
import {
    ReservasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.reservationControllerSyncCalendar(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**SyncCalendarResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** | Reserva no encontrada |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reservationControllerUpdate**
> ReservationResponseDto reservationControllerUpdate(updateReservationDto)


### Example

```typescript
import {
    ReservasApi,
    Configuration,
    UpdateReservationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let id: number; // (default to undefined)
let updateReservationDto: UpdateReservationDto; //

const { status, data } = await apiInstance.reservationControllerUpdate(
    id,
    updateReservationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateReservationDto** | **UpdateReservationDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

# **reservationControllerUpdateServiceLineEstimate**
> ReservationResponseDto reservationControllerUpdateServiceLineEstimate(updateServiceLineEstimateDto)


### Example

```typescript
import {
    ReservasApi,
    Configuration,
    UpdateServiceLineEstimateDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let lineId: number; // (default to undefined)
let updateServiceLineEstimateDto: UpdateServiceLineEstimateDto; //

const { status, data } = await apiInstance.reservationControllerUpdateServiceLineEstimate(
    lineId,
    updateServiceLineEstimateDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateServiceLineEstimateDto** | **UpdateServiceLineEstimateDto**|  | |
| **lineId** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

# **reservationControllerUpdateStatus**
> ReservationResponseDto reservationControllerUpdateStatus(updateReservationStatusDto)


### Example

```typescript
import {
    ReservasApi,
    Configuration,
    UpdateReservationStatusDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservasApi(configuration);

let id: number; // (default to undefined)
let updateReservationStatusDto: UpdateReservationStatusDto; //

const { status, data } = await apiInstance.reservationControllerUpdateStatus(
    id,
    updateReservationStatusDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateReservationStatusDto** | **UpdateReservationStatusDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ReservationResponseDto**

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

