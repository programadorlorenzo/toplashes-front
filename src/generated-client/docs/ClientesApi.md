# ClientesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**customerControllerCreate**](#customercontrollercreate) | **POST** /customers | Crear cliente|
|[**customerControllerFindAll**](#customercontrollerfindall) | **GET** /customers | Listar o buscar clientes|
|[**customerControllerFindOne**](#customercontrollerfindone) | **GET** /customers/{id} | Obtener cliente por ID|
|[**customerControllerRemove**](#customercontrollerremove) | **DELETE** /customers/{id} | Eliminar cliente|
|[**customerControllerUpdate**](#customercontrollerupdate) | **PUT** /customers/{id} | Actualizar cliente|

# **customerControllerCreate**
> CustomerResponseDto customerControllerCreate(createCustomerDto)


### Example

```typescript
import {
    ClientesApi,
    Configuration,
    CreateCustomerDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ClientesApi(configuration);

let createCustomerDto: CreateCustomerDto; //

const { status, data } = await apiInstance.customerControllerCreate(
    createCustomerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCustomerDto** | **CreateCustomerDto**|  | |


### Return type

**CustomerResponseDto**

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

# **customerControllerFindAll**
> Array<CustomerResponseDto> customerControllerFindAll()


### Example

```typescript
import {
    ClientesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClientesApi(configuration);

let search: string; //Buscar por nombre o WhatsApp (optional) (default to undefined)

const { status, data } = await apiInstance.customerControllerFindAll(
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | Buscar por nombre o WhatsApp | (optional) defaults to undefined|


### Return type

**Array<CustomerResponseDto>**

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

# **customerControllerFindOne**
> CustomerResponseDto customerControllerFindOne()


### Example

```typescript
import {
    ClientesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClientesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.customerControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**CustomerResponseDto**

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

# **customerControllerRemove**
> customerControllerRemove()


### Example

```typescript
import {
    ClientesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClientesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.customerControllerRemove(
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
|**200** | Cliente eliminado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customerControllerUpdate**
> CustomerResponseDto customerControllerUpdate(updateCustomerDto)


### Example

```typescript
import {
    ClientesApi,
    Configuration,
    UpdateCustomerDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ClientesApi(configuration);

let id: number; // (default to undefined)
let updateCustomerDto: UpdateCustomerDto; //

const { status, data } = await apiInstance.customerControllerUpdate(
    id,
    updateCustomerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCustomerDto** | **UpdateCustomerDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**CustomerResponseDto**

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

