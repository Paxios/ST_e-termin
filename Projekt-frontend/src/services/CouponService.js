import axios from 'axios';
import addOAuthInterceptor from "axios-oauth-1.0a";

const COUPON_API_BASE_URL = "http://studentdocker.informatika.uni-mb.si:20285/wp-json/wc/v3/coupons";

const client = axios.create();

addOAuthInterceptor(client, {
    key: "ck_972561c1c9fc45e1a03c9ee8751a0acae3d61cd8",
    secret: "cs_63446b19dc6f05d9e843980df6d2dc16f8ce7843",
    algorithm: "HMAC-SHA1",
});

class CouponService {

    getCoupons(){
        return client.get(COUPON_API_BASE_URL);
    }

    createCoupon(coupon){
        return client.post(COUPON_API_BASE_URL, coupon);
    }

    getCouponById(couponId){
        return client.get(COUPON_API_BASE_URL + '/' + couponId);
    }

    updateCoupon(coupon, couponId){
        return client.put(COUPON_API_BASE_URL + '/' + couponId, coupon);
    }

    deleteCoupon(couponId){
        return client.delete(COUPON_API_BASE_URL + '/' + couponId,{ params: {
            force:true
          }});
    }
}

export default new CouponService()