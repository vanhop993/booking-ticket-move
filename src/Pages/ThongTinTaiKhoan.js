import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../assets/img/avatar.png';
import ItemThongTinRapChieuPhim from '../Components/ItemThongTinRapChieuPhim';
import { displayLoading } from '../Redux/Action/LoadingAction';
import { thongTinTaiKhoanAction } from '../Redux/Action/QuanLyNguoiDungAction';
import { layThongTinLichChieuHeThongRapApiAction } from '../Redux/Action/QuanLyPhimAction';
import moment from 'moment';

export default function ThongTinTaiKhoan() {
    let thongTinTaiKhoanLocalstore = JSON.parse(localStorage.getItem('USER_LOGIN'));
    const dispatch = useDispatch();
    useEffect(() => {
        let taiKhoan = {
            "taiKhoan": thongTinTaiKhoanLocalstore.taiKhoan,
          }
        async function fetchData() {
          dispatch(await thongTinTaiKhoanAction(taiKhoan));
          dispatch(await layThongTinLichChieuHeThongRapApiAction());
        }
        fetchData();
      }, []);
    const  {thongTinTaiKhoan}  = useSelector(state => state.QuanLyNguoiDungReducer);
    const { lichChieuHeThongRap } = useSelector(state => state.QuanLyPhimReducer) ;
    // console.log('thongTinTaiKhoan',thongTinTaiKhoan);
    // console.log('lichChieuHeThongRap',lichChieuHeThongRap);
    useEffect(() => {
        return () => {
          dispatch(displayLoading())
        };
      },[]);
    const renderLichSuDatVe = () => {
        return thongTinTaiKhoan.thongTinDatVe?.map((item,index)=> {
            console.log('item',item);
            let itemHeThongRapDatVe = lichChieuHeThongRap.find(item1 => item1.maHeThongRap === item.danhSachGhe[0].maHeThongRap);
            let itemCumRapDatVe = itemHeThongRapDatVe.lstCumRap.find(item1 => item1.tenCumRap.trim() === item.danhSachGhe[0].tenHeThongRap.trim());
            let itemPhimDatVe = itemCumRapDatVe?.danhSachPhim.find(item1 => item1.tenPhim === item.tenPhim);
            let tenCumRap = itemCumRapDatVe.tenCumRap.split('-');
            // console.log('itemHeThongRapDatVe',itemHeThongRapDatVe);
            // console.log('itemCumRapDatVe',itemCumRapDatVe);
            // console.log('itemPhimDatVe',itemPhimDatVe);
            if(itemPhimDatVe){
                return (
                    <div className='my-2 d-flex' key={index}>
                        <img src={itemPhimDatVe?.hinhAnh} alt={itemPhimDatVe?.tenPhim} data-toggle="tooltip" data-placement="top" title={itemPhimDatVe?.tenPhim} width={100} height={150}/>
                        <div className='ml-2'>
                            <ItemThongTinRapChieuPhim 
                                logo={itemHeThongRapDatVe.logo} 
                                maCumRap={itemCumRapDatVe.maCumRap} 
                                tenCumRapx={tenCumRap[0]} 
                                tenCumRap={tenCumRap} 
                                maHeThongRap={itemHeThongRapDatVe.maHeThongRap}
                            />
                            <div>
                                {
                                    item.danhSachGhe.map((itemGhe, index) => (
                                        <div style ={{padding:'0 20px'}} key={index}>Ngày đặt: {moment(item.ngayDat).format('DD/MM/yyyy HH:MM')} - {itemGhe.tenCumRap} - Ghế {itemGhe.tenGhe}</div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            }else{
                return null;
            }
        })
    }
    return (
        <div className='container my-5'>
            <h3 className='text-center font-weight-bold'>Thông tin người dùng</h3>
            <div className="row">
                <div className="col-4 text-center">
                    <img src={avatar} alt={avatar}/>
                </div>
                <div className="col-8" style={{fontSize:'1.5rem'}}>
                    <p><span>Họ tên: </span>{thongTinTaiKhoan.hoTen}</p>
                    <p><span>Email: </span>{thongTinTaiKhoan.email}</p>
                    <p><span>Số điện thoại: </span>{thongTinTaiKhoan.soDT}</p>
                    <p><span>Loại tài khoản: </span>{thongTinTaiKhoan.maLoaiNguoiDung}</p>
                </div>
            </div>
            <div className="row">
                <h4>Lịch sử đặt vé</h4>
                <div className='col-12'>
                    {
                        // thongTinTaiKhoan.thongTinDatVe?.map((item,index)=> {
                        //     return (
                        //         <div>
                        //             <div>Tên phim: {item.tenPhim}</div>
                        //             <div>Rap chiếu: {item.danhSachGhe[0].tenHeThongRap}</div>
                        //             <div><DiaChiCumRap maHeThongRap = {item.maHeThongRap}/></div>
                        //         </div>
                        //     )
                        // })
                        renderLichSuDatVe()
                    }
                </div>
            </div>
        </div>
    )
}
