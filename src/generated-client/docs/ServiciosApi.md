# ServiciosApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**serviceControllerAssignBranches**](#servicecontrollerassignbranches) | **PUT** /services/{id}/branches | Asignar servicio a sucursales|
|[**serviceControllerCreate**](#servicecontrollercreate) | **POST** /services | Crear servicio|
|[**serviceControllerFindAll**](#servicecontrollerfindall) | **GET** /services | Listar servicios|
|[**serviceControllerFindOne**](#servicecontrollerfindone) | **GET** /services/{id} | Obtener servicio por ID|
|[**serviceControllerRemove**](#servicecontrollerremove) | **DELETE** /services/{id} | Eliminar servicio|
|[**serviceControllerUpdate**](#servicecontrollerupdate) | **PUT** /services/{id} | Actualizar servicio|

# **serviceControllerAssignBranches**
> ServiceResponseDto serviceControllerAssignBranches(assignServiceBranchesDto)


### Example

```typescript
import {
    ServiciosApi,
    Configuration,
    AssignServiceBranchesDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ServiciosApi(configuration);

let id: number; // (default to undefined)
let assignServiceBranchesDto: AssignServiceBranchesDto; //

const { status, data } = await apiInstance.serviceControllerAssignBranches(
    id,
    assignServiceBranchesDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignServiceBranchesDto** | **AssignServiceBranchesDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ServiceResponseDto**

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

# **serviceControllerCreate**
> ServiceResponseDto serviceControllerCreate(createServiceDto)


### Example

```typescript
import {
    ServiciosApi,
    Configuration,
    CreateServiceDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ServiciosApi(configuration);

let createServiceDto: CreateServiceDto; //

const { status, data } = await apiInstance.serviceControllerCreate(
    createServiceDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createServiceDto** | **CreateServiceDto**|  | |


### Return type

**ServiceResponseDto**

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

# **serviceControllerFindAll**
> Array<ServiceResponseDto> serviceControllerFindAll()


### Example

```typescript
import {
    ServiciosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ServiciosApi(configuration);

const { status, data } = await apiInstance.serviceControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ServiceResponseDto>**

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

# **serviceControllerFindOne**
> ServiceResponseDto serviceControllerFindOne()


### Example

```typescript
import {
    ServiciosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ServiciosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.serviceControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ServiceResponseDto**

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

# **serviceControllerRemove**
> serviceControllerRemove()


### Example

```typescript
import {
    ServiciosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ServiciosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.serviceControllerRemove(
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
|**200** | Servicio eliminado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **serviceControllerUpdate**
> ServiceResponseDto serviceControllerUpdate(updateServiceDto)


### Example

```typescript
import {
    ServiciosApi,
    Configuration,
    UpdateServiceDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ServiciosApi(configuration);

let id: number; // (default to undefined)
let updateServiceDto: UpdateServiceDto; //

const { status, data } = await apiInstance.serviceControllerUpdate(
    id,
    updateServiceDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateServiceDto** | **UpdateServiceDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ServiceResponseDto**

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

