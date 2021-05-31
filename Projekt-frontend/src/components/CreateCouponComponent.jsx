import React, { Component } from 'react'
import CouponService from '../services/CouponService';

class CreateCouponComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            amount: '',
            code: '',
            discount_type: ''
        }
        this.changeAmountHandler = this.changeAmountHandler.bind(this);
        this.changeCodeHandler = this.changeCodeHandler.bind(this);
        this.changeDiscountTypeHandler = this.changeDiscountTypeHandler.bind(this);
        this.saveOrUpdateCoupon = this.saveOrUpdateCoupon.bind(this);
    }

    componentDidMount(){

        if(this.state.id === '_add'){
            return
        }else{
            CouponService.getCouponById(this.state.id).then( (res) =>{
                let coupon = res.data;
                this.setState({amount: coupon.amount,
                    code: coupon.code,
                    discount_type : coupon.discount_type
                });
            });
        }        
    }
    saveOrUpdateCoupon = (e) => {
        e.preventDefault();
        let coupon = {amount: this.state.amount,code: this.state.code, discount_type: this.state.discount_type};
        console.log('coupon => ' + JSON.stringify(coupon));

        if(this.state.id === '_add'){
            CouponService.createCoupon(coupon).then(res =>{
                this.props.history.push('/coupons');
            });
        }else{
            CouponService.updateCoupon(coupon, this.state.id).then( res => {
                this.props.history.push('/coupons');
            });
        }
    }
    
    changeAmountHandler= (event) => {
        this.setState({amount: event.target.value});
    }

    changeCodeHandler= (event) => {
        this.setState({code: event.target.value});
    }

    changeDiscountTypeHandler= (event) => {
        this.setState({discount_type: event.target.value});
    }

    cancel(){
        this.props.history.push('/coupons');
    }

    getTitle(){
        if(this.state.id === '_add'){
            return <h3 className="text-center">Add Coupon</h3>
        }else{
            return <h3 className="text-center">Update Coupon</h3>
        }
    }
    render() {
        return (
            <div>
                <br></br>
                   <div className = "container">
                        <div className = "row">
                            <div className = "card col-md-6 offset-md-3 offset-md-3">
                                {
                                    this.getTitle()
                                }
                                <div className = "card-body">
                                    <form>
                                        <div className = "form-group">
                                            <label> Amount: </label>
                                            <input placeholder="Amount" name="amount" className="form-control" 
                                                value={this.state.amount} onChange={this.changeAmountHandler}/>
                                        </div>
                                        <div className = "form-group">
                                            <label> Code: </label>
                                            <input placeholder="Code" name="code" className="form-control" 
                                                value={this.state.code} onChange={this.changeCodeHandler}/>
                                        </div>
                                        <div className = "form-group">
                                            <label> Discount type: </label>
                                            <input placeholder="DiscountType" name="discount_type" className="form-control" 
                                                value={this.state.discount_type} onChange={this.changeDiscountTypeHandler}/>
                                        </div>

                                        <button className="btn btn-success" onClick={this.saveOrUpdateCoupon}>Save</button>
                                        <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                   </div>
            </div>
        )
    }
}

export default CreateCouponComponent
