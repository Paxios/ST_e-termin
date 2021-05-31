import React, { Component } from 'react'
import CouponService from '../services/CouponService'

class ListCouponComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                coupons: []
        }
        this.addCoupon = this.addCoupon.bind(this);
        this.editCoupon = this.editCoupon.bind(this);
        this.deleteCoupon = this.deleteCoupon.bind(this);
        this.navigateCustomers = this.navigateCustomers.bind(this);
    }

    deleteCoupon(id){
        CouponService.deleteCoupon(id).then( res => {
            this.setState({coupons: this.state.coupons.filter(coupon => coupon.id !== id)});
        });
    }

    editCoupon(id){
        this.props.history.push(`/add-coupon/${id}`);
    }

    componentDidMount(){
        CouponService.getCoupons().then((res) => {
            console.log(res)
            this.setState({ coupons: res.data});
        });
    }

    addCoupon(){
        this.props.history.push('/add-coupon/_add');
    }

    navigateCustomers() {
        this.props.history.push('/customers');
    }

    render() {
        return (
            <div>
                 <h2 className="text-center">Coupon List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.addCoupon}> Add Coupon</button>
                    &nbsp;
                    <button className="btn btn-secondary" onClick={this.navigateCustomers}> Customers</button>
                 </div>
                 <br></br>
                 <div className = "row">
                        <table className = "table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th> Code</th>
                                    <th> Amount</th>
                                    <th> Discount Type</th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.coupons.map(
                                        coupon => 
                                        <tr key = {coupon.id}>
                                             <td> { coupon.code} </td>   
                                             <td> {coupon.amount}</td>
                                             <td> {coupon.discount_type}</td>
                                             <td>
                                                 <button onClick={ () => this.editCoupon(coupon.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.deleteCoupon(coupon.id)} className="btn btn-danger">Delete </button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                 </div>
            </div>
        )
    }
}

export default ListCouponComponent
