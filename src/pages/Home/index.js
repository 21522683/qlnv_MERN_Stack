// Home.jsx
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import SearchBar from '../../components/SearchBar';
import ItemTable from '../../components/ItemTable';
import { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import "react-datepicker/dist/react-datepicker.css";
import ModalAdd from '../ModalAdd';
import baseUrl from '../../utils';
import axios from 'axios';
import ModalUpdate from '../ModalUpdate';
import MessageBoxDelete from '../../components/MessageBoxDelete';

const cx = classNames.bind(styles);

function Home() {
    const [birthday, setBirthdate] = useState('');
    const [gender, setGender] = useState("Tất cả");
    const [staffList, setStaffList] = useState([]);
    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [itemStaff, setItemStaff] = useState({});

    const [totalPages, setTotalPages] = useState(0);
    const [pathWithQuery, setPathWithQuery] = useState('');
    const [filter, setFilter] = useState({
        textSearch: '',
        gender: 'Tất cả',
        birthday: '',
        page: 1,
    });

    useEffect(() => {
        handleChangeGenderFilter(gender);
        handleChangeBirthdayFilter(birthday);
    }, [gender, birthday]);

    useEffect(() => {
        const queryParams = { page: filter.page, searchString: filter.textSearch.trim(), gender: filter.gender, birthday: filter.birthday !== null ? filter.birthday : '' };
        const queryString = new URLSearchParams(queryParams).toString();
        const pathWithQuery = `${baseUrl}/api/staffs/getAllStaff?${queryString}`;
        setPathWithQuery(pathWithQuery);
    }, [filter]);
    
    
    useEffect(() => {
        if (pathWithQuery) {
            getAllStaff();
        }
    }, [pathWithQuery]);

    useEffect(() => {
        setStaffList(staffList);
    }, [staffList]);

    const getAllStaff = async () => {
        try {
            const queryParams = {
                searchString: filter.textSearch,
                gender: filter.gender,
                birthday: filter.birthday,
                page: filter.page,
            };
            const response = await axios.get(pathWithQuery, queryParams);
            console.log(response);
            setStaffList(response.data.staffs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching staffs:', error);
        }
    };

    const formatDate = (date) => {
        // Kiểm tra nếu date là một đối tượng Date, không cần chuyển đổi
        if (!(date instanceof Date)) {
            date = new Date(date); // Chuyển đổi giá trị ngày thành đối tượng Date
        }
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    };
    
    
    const handleChangeBirthdayFilter = (value) => {
        const selectedDate = new Date(value);
        const formattedDate = formatDate(selectedDate);
        setFilter((prev) => ({ ...prev, birthday: formattedDate }));
    };
    const handleChangeInputSearch = (value) => {
        setFilter((prev) => ({ ...prev, textSearch: value }));
    };

    const handleChangeGenderFilter = (value) => {
        setFilter((prev) => ({ ...prev, gender: value }));
    };

    const handleClickPreviousPage = () => {
        if (filter.page === 1) return;
        setFilter((prev) => ({ ...prev, page: prev.page - 1 }));
    };
    const handleClickNextPage = () => {
        if (filter.page === totalPages) return;
        setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
    };

    const handleOnclickUpdate = (staff) => {
        setIsOpenModalUpdate(true);
        setItemStaff(staff);
    }

    const handleOnclickDelete = (staff) => {
        setIsOpenModalDelete(true);
        setItemStaff(staff);
    }


    return (
        <div className={cx('wrapper')}>
            {
                isOpenModalAdd && <ModalAdd setIsOpenModalAdd={setIsOpenModalAdd} getAllStaff={getAllStaff} />
            }
            {
                isOpenModalUpdate && <ModalUpdate itemStaff={itemStaff} setIsOpenModalUpdate={setIsOpenModalUpdate} getAllStaff={getAllStaff} />
            }
            {
                isOpenModalDelete && <MessageBoxDelete itemStaff={itemStaff} setIsOpenModalDelete={setIsOpenModalDelete} getAllStaff={getAllStaff} />
            }
            <div className={cx('header')}>
                Quản lý nhân viên
            </div>
            <div className={cx('body')}>
                <div className={cx('first')}>
                    <SearchBar handleChangeInput={handleChangeInputSearch} />
                    <div className={cx('wrap-select')}>
                        <input
                            type='date'
                            className={cx('datepicker')}
                            value={birthday}
                            onChange={(event) => setBirthdate(event.target.value)}
                        />
                        <select
                            className={cx('select-option')}
                            value={gender}
                            onChange={(event) => setGender(event.target.value)} >
                            <option value="Tất cả">Tất cả</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                        <div className={cx('button-add')} onClick={() => setIsOpenModalAdd(true)}>
                            Thêm nhân viên
                        </div>
                    </div>
                </div>

                <div className={cx('table-container')}>
                    <div className={cx('table-main')}>
                        <div className={cx('head-table')}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Họ và tên</th>
                                        <th>Ngày sinh</th>
                                        <th>Giới tính</th>
                                        <th>Cập nhật / Xóa</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className={cx('body-table')}>
                            <table>
                                <tbody>
                                    {
                                        staffList?.map((staff, index) => {
                                            return (
                                                <ItemTable key={index} staff={staff} handleOnclickUpdate={handleOnclickUpdate} handleOnclickDelete={handleOnclickDelete} />
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {
                        totalPages > 0 &&
                        <div className={cx('pagination-wrapper')}>
                            <div className={cx('pagination')}>
                                <span className={cx('icon')} onClick={handleClickPreviousPage}>
                                    <FaAngleLeft style={{ color: '#0088af' }} />
                                </span>
                                <span className={cx('curent')}>{`${filter.page} của ${totalPages}`}</span>
                                <span className={cx('icon')} onClick={handleClickNextPage}>
                                    <FaAngleRight style={{ color: '#0088af' }} />
                                </span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Home;
