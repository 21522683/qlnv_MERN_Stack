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
import ModalUpdate from '../ModalUpdate';
import MessageBoxDelete from '../../components/MessageBoxDelete';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataGetAllStaff, setIsOpenModalAdd } from '../../redux/slices/staffSlice';

const cx = classNames.bind(styles);

function Home() {
    const isOpenModalAdd = useSelector(state => state.staffManagement.isOpenModalAdd);
    const isOpenModalUpdate = useSelector(state => state.staffManagement.isOpenModalUpdate);
    const isOpenModalDelete = useSelector(state => state.staffManagement.isOpenModalDelete);
    
    
    const [pathWithQuery, setPathWithQuery] = useState('');

    const dispatch = useDispatch();

    let staffsList = useSelector(state => state.staffManagement.staffsList);
    let totalPages = useSelector(state => state.staffManagement.totalPages);


    const [filter, setFilter] = useState({
        textSearch: '',
        gender: 'Tất cả',
        birthday: '',
        page: 1,
    });


    useEffect(() => {
        const queryParams = { page: filter.page, searchString: filter.textSearch.trim(), gender: filter.gender, birthday: filter.birthday };
        const queryString = new URLSearchParams(queryParams).toString();
        const pathWithQuery = `${baseUrl}/api/staffs/getAllStaff?${queryString}`;
        setPathWithQuery(pathWithQuery);
    }, [filter]);


    useEffect(() => {
        if (pathWithQuery) {
            getAllStaff();
        }
    }, [pathWithQuery]);

    const [queryParamsString, setQueryParamsString] = useState({});
    const getAllStaff = async () => {
        const queryParams = {
            searchString: filter.textSearch,
            gender: filter.gender,
            birthday: filter.birthday,
            page: filter.page,
        };
        setQueryParamsString(prve => {
            return {
               ...prve,
               ...queryParams
            }
        });

        dispatch(fetchDataGetAllStaff([pathWithQuery, queryParams]));
    };

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        setFilter(prev => {
            return { ...prev, birthday: formattedDate };
        })
    }, []);

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
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

    const handleClickAddButton = () => {
        dispatch(setIsOpenModalAdd(true));
    }

    const handleChangeGenderFilter = (value) => {
        console.log("fillter:  ", filter);
        setFilter(prev => ({ ...prev, gender: value }));
    };
    
    const handleChangeBirthdayFilter = (value) => {
        console.log(value);
        if (value === '') {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            setFilter(prev => ({ ...prev, birthday: formattedDate }));
        }
        else {
            const selectedDate = new Date(value);
            if (!isNaN(selectedDate.getTime())) {
                const formattedDate = formatDate(selectedDate);
                setFilter(prev => ({ ...prev, birthday: formattedDate }));
            }
        }
    };
    
    const handleChangeInputSearch = (value) => {
        setFilter((prev) => ({ ...prev, textSearch: value }));
    };

    const handleClickPreviousPage = () => {
        if (filter.page === 1) return;
        setFilter(prev => ({ ...prev, page: prev.page - 1 }));
    };
    const handleClickNextPage = () => {
        if (filter.page === totalPages) return;
        setFilter(prev => ({ ...prev, page: prev.page + 1 }));
        console.log(filter.page);
    };

    return (
        <div className={cx('wrapper')}>
            {
                isOpenModalAdd && <ModalAdd pathWithQuery={pathWithQuery} queryParamsString={queryParamsString}/>
            }
            {
                isOpenModalUpdate && <ModalUpdate/>
            }
            {
                isOpenModalDelete && <MessageBoxDelete pathWithQuery={pathWithQuery} queryParamsString={queryParamsString}/>
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
                            value={filter.birthday}
                            onChange={(event) => handleChangeBirthdayFilter(event.target.value)}
                        />
                        <select
                            className={cx('select-option')}
                            value={filter.gender}
                            onChange={(event) => handleChangeGenderFilter(event.target.value)} >
                            <option value="Tất cả">Tất cả</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                        <div className={cx('button-add')} onClick={handleClickAddButton}>
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
                                        staffsList.map((staff, index) => {
                                            return (
                                                <ItemTable key={index} staff={staff} index={index} />
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
