# RolesYPermisosApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**roleControllerCreate**](#rolecontrollercreate) | **POST** /roles | Crear rol|
|[**roleControllerFindAll**](#rolecontrollerfindall) | **GET** /roles | Listar roles|
|[**roleControllerFindAllPermissions**](#rolecontrollerfindallpermissions) | **GET** /roles/permissions | Listar todos los permisos disponibles|
|[**roleControllerFindOne**](#rolecontrollerfindone) | **GET** /roles/{id} | Obtener rol por ID|
|[**roleControllerRemove**](#rolecontrollerremove) | **DELETE** /roles/{id} | Eliminar rol|
|[**roleControllerUpdate**](#rolecontrollerupdate) | **PUT** /roles/{id} | Actualizar rol|

# **roleControllerCreate**
> RoleResponseDto roleControllerCreate(createRoleDto)


### Example

```typescript
import {
    RolesYPermisosApi,
    Configuration,
    CreateRoleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RolesYPermisosApi(configuration);

let createRoleDto: CreateRoleDto; //

const { status, data } = await apiInstance.roleControllerCreate(
    createRoleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRoleDto** | **CreateRoleDto**|  | |


### Return type

**RoleResponseDto**

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

# **roleControllerFindAll**
> Array<RoleResponseDto> roleControllerFindAll()


### Example

```typescript
import {
    RolesYPermisosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RolesYPermisosApi(configuration);

const { status, data } = await apiInstance.roleControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<RoleResponseDto>**

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

# **roleControllerFindAllPermissions**
> Array<PermissionResponseDto> roleControllerFindAllPermissions()


### Example

```typescript
import {
    RolesYPermisosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RolesYPermisosApi(configuration);

const { status, data } = await apiInstance.roleControllerFindAllPermissions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<PermissionResponseDto>**

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

# **roleControllerFindOne**
> RoleResponseDto roleControllerFindOne()


### Example

```typescript
import {
    RolesYPermisosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RolesYPermisosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.roleControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RoleResponseDto**

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

# **roleControllerRemove**
> roleControllerRemove()


### Example

```typescript
import {
    RolesYPermisosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RolesYPermisosApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.roleControllerRemove(
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
|**200** | Rol eliminado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **roleControllerUpdate**
> RoleResponseDto roleControllerUpdate(updateRoleDto)


### Example

```typescript
import {
    RolesYPermisosApi,
    Configuration,
    UpdateRoleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RolesYPermisosApi(configuration);

let id: number; // (default to undefined)
let updateRoleDto: UpdateRoleDto; //

const { status, data } = await apiInstance.roleControllerUpdate(
    id,
    updateRoleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRoleDto** | **UpdateRoleDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RoleResponseDto**

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

