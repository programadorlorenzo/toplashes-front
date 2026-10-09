# SucursalesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**branchControllerCreate**](#branchcontrollercreate) | **POST** /branches | Crear sucursal|
|[**branchControllerFindAll**](#branchcontrollerfindall) | **GET** /branches | Listar sucursales|
|[**branchControllerFindOne**](#branchcontrollerfindone) | **GET** /branches/{id} | Obtener sucursal por ID|
|[**branchControllerRemove**](#branchcontrollerremove) | **DELETE** /branches/{id} | Eliminar sucursal|
|[**branchControllerUpdate**](#branchcontrollerupdate) | **PUT** /branches/{id} | Actualizar sucursal|

# **branchControllerCreate**
> BranchResponseDto branchControllerCreate(createBranchDto)


### Example

```typescript
import {
    SucursalesApi,
    Configuration,
    CreateBranchDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SucursalesApi(configuration);

let createBranchDto: CreateBranchDto; //

const { status, data } = await apiInstance.branchControllerCreate(
    createBranchDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBranchDto** | **CreateBranchDto**|  | |


### Return type

**BranchResponseDto**

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

# **branchControllerFindAll**
> Array<BranchResponseDto> branchControllerFindAll()


### Example

```typescript
import {
    SucursalesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SucursalesApi(configuration);

const { status, data } = await apiInstance.branchControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<BranchResponseDto>**

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

# **branchControllerFindOne**
> BranchResponseDto branchControllerFindOne()


### Example

```typescript
import {
    SucursalesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SucursalesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.branchControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**BranchResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** | Sucursal no encontrada |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **branchControllerRemove**
> branchControllerRemove()


### Example

```typescript
import {
    SucursalesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SucursalesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.branchControllerRemove(
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
|**200** | Sucursal eliminada |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **branchControllerUpdate**
> BranchResponseDto branchControllerUpdate(updateBranchDto)


### Example

```typescript
import {
    SucursalesApi,
    Configuration,
    UpdateBranchDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SucursalesApi(configuration);

let id: number; // (default to undefined)
let updateBranchDto: UpdateBranchDto; //

const { status, data } = await apiInstance.branchControllerUpdate(
    id,
    updateBranchDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateBranchDto** | **UpdateBranchDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**BranchResponseDto**

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

