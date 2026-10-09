# PagosApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**paymentControllerCreate**](#paymentcontrollercreate) | **POST** /payments | Registrar pago|
|[**paymentControllerFindAll**](#paymentcontrollerfindall) | **GET** /payments | Listar pagos con filtros|
|[**paymentControllerFindByReservation**](#paymentcontrollerfindbyreservation) | **GET** /payments/reservations/{reservationId} | Pagos de una reserva|
|[**paymentControllerGetReservationBalance**](#paymentcontrollergetreservationbalance) | **GET** /payments/reservations/{reservationId}/balance | Saldo de una reserva|
|[**paymentControllerRefund**](#paymentcontrollerrefund) | **POST** /payments/{id}/refund | Registrar devolución sobre un pago|

# **paymentControllerCreate**
> PaymentResponseDto paymentControllerCreate(createPaymentDto)


### Example

```typescript
import {
    PagosApi,
    Configuration,
    CreatePaymentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PagosApi(configuration);

let createPaymentDto: CreatePaymentDto; //

const { status, data } = await apiInstance.paymentControllerCreate(
    createPaymentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPaymentDto** | **CreatePaymentDto**|  | |


### Return type

**PaymentResponseDto**

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

# **paymentControllerFindAll**
> Array<PaymentResponseDto> paymentControllerFindAll()


### Example

```typescript
import {
    PagosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PagosApi(configuration);

let branchId: number; // (optional) (default to undefined)
let fromDate: string; //YYYY-MM-DD (optional) (default to undefined)
let toDate: string; //YYYY-MM-DD (optional) (default to undefined)
let method: 'cash' | 'yape' | 'plin' | 'transfer' | 'card' | 'other'; // (optional) (default to undefined)

const { status, data } = await apiInstance.paymentControllerFindAll(
    branchId,
    fromDate,
    toDate,
    method
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **branchId** | [**number**] |  | (optional) defaults to undefined|
| **fromDate** | [**string**] | YYYY-MM-DD | (optional) defaults to undefined|
| **toDate** | [**string**] | YYYY-MM-DD | (optional) defaults to undefined|
| **method** | [**&#39;cash&#39; | &#39;yape&#39; | &#39;plin&#39; | &#39;transfer&#39; | &#39;card&#39; | &#39;other&#39;**]**Array<&#39;cash&#39; &#124; &#39;yape&#39; &#124; &#39;plin&#39; &#124; &#39;transfer&#39; &#124; &#39;card&#39; &#124; &#39;other&#39;>** |  | (optional) defaults to undefined|


### Return type

**Array<PaymentResponseDto>**

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

# **paymentControllerFindByReservation**
> Array<PaymentResponseDto> paymentControllerFindByReservation()


### Example

```typescript
import {
    PagosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PagosApi(configuration);

let reservationId: number; // (default to undefined)

const { status, data } = await apiInstance.paymentControllerFindByReservation(
    reservationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservationId** | [**number**] |  | defaults to undefined|


### Return type

**Array<PaymentResponseDto>**

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

# **paymentControllerGetReservationBalance**
> ReservationBalanceResponseDto paymentControllerGetReservationBalance()


### Example

```typescript
import {
    PagosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PagosApi(configuration);

let reservationId: number; // (default to undefined)

const { status, data } = await apiInstance.paymentControllerGetReservationBalance(
    reservationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservationId** | [**number**] |  | defaults to undefined|


### Return type

**ReservationBalanceResponseDto**

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

# **paymentControllerRefund**
> PaymentResponseDto paymentControllerRefund(refundPaymentDto)


### Example

```typescript
import {
    PagosApi,
    Configuration,
    RefundPaymentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PagosApi(configuration);

let id: number; // (default to undefined)
let refundPaymentDto: RefundPaymentDto; //

const { status, data } = await apiInstance.paymentControllerRefund(
    id,
    refundPaymentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refundPaymentDto** | **RefundPaymentDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**PaymentResponseDto**

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

