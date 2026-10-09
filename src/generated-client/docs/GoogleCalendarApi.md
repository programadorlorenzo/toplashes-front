# GoogleCalendarApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**googleCalendarControllerCallback**](#googlecalendarcontrollercallback) | **GET** /google-calendar/callback | Callback OAuth de Google|
|[**googleCalendarControllerConnect**](#googlecalendarcontrollerconnect) | **GET** /google-calendar/connect | Iniciar flujo OAuth con Google Calendar (redirige a Google)|
|[**googleCalendarControllerDisconnect**](#googlecalendarcontrollerdisconnect) | **POST** /google-calendar/disconnect/{id} | Desconectar una cuenta de Google Calendar|
|[**googleCalendarControllerGetAuthUrl**](#googlecalendarcontrollergetauthurl) | **GET** /google-calendar/auth-url | Obtener URL de autorización sin redirigir|
|[**googleCalendarControllerListTokens**](#googlecalendarcontrollerlisttokens) | **GET** /google-calendar/tokens | Listar conexiones de Google Calendar|

# **googleCalendarControllerCallback**
> googleCalendarControllerCallback()


### Example

```typescript
import {
    GoogleCalendarApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GoogleCalendarApi(configuration);

let code: string; // (default to undefined)
let state: string; // (default to undefined)

const { status, data } = await apiInstance.googleCalendarControllerCallback(
    code,
    state
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **code** | [**string**] |  | defaults to undefined|
| **state** | [**string**] |  | defaults to undefined|


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
|**200** | Conexión exitosa |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **googleCalendarControllerConnect**
> googleCalendarControllerConnect()


### Example

```typescript
import {
    GoogleCalendarApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GoogleCalendarApi(configuration);

let branchId: number; //ID de sucursal (vacío = global) (optional) (default to undefined)

const { status, data } = await apiInstance.googleCalendarControllerConnect(
    branchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchId** | [**number**] | ID de sucursal (vacío &#x3D; global) | (optional) defaults to undefined|


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
|**302** | Redirige a Google |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **googleCalendarControllerDisconnect**
> googleCalendarControllerDisconnect()


### Example

```typescript
import {
    GoogleCalendarApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GoogleCalendarApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.googleCalendarControllerDisconnect(
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
|**200** | Desconectado |  -  |
|**404** | Token no encontrado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **googleCalendarControllerGetAuthUrl**
> googleCalendarControllerGetAuthUrl()


### Example

```typescript
import {
    GoogleCalendarApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GoogleCalendarApi(configuration);

let branchId: number; //ID de sucursal (vacío = global) (optional) (default to undefined)

const { status, data } = await apiInstance.googleCalendarControllerGetAuthUrl(
    branchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchId** | [**number**] | ID de sucursal (vacío &#x3D; global) | (optional) defaults to undefined|


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
|**200** | URL de autorización |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **googleCalendarControllerListTokens**
> Array<GoogleCalendarTokenResponseDto> googleCalendarControllerListTokens()


### Example

```typescript
import {
    GoogleCalendarApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GoogleCalendarApi(configuration);

const { status, data } = await apiInstance.googleCalendarControllerListTokens();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<GoogleCalendarTokenResponseDto>**

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

