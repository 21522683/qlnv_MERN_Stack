import React, { useState } from 'react'
import classNames from "classnames/bind";
import styles from './ItemTable.module.scss'
import convertDate from '../../utils/convertDate';
import { useDispatch } from 'react-redux';
import { setIndexStaffSelected, setIsOpenModalUpdate , setIsOpenModalDelete} from '../../redux/slices/staffSlice';


const cx = classNames.bind(styles)

function ItemTable({ staff , index}) {

  const dispatch = useDispatch();

  const handleClickUpdateButton = () => {
    dispatch(setIndexStaffSelected(index));
    dispatch(setIsOpenModalUpdate(true));
  }

  const handleClickDeleteButton = () => {
    dispatch(setIndexStaffSelected(index));
    dispatch(setIsOpenModalDelete(true));
  }
  

  return (
    <tr className={cx('row-table')}>
      <td>
        <img className={cx('item-table-img')} src={staff.avatar.url} alt="img" />
      </td>
      <td>{staff.name}</td>
      <td>{convertDate(staff.birthday)}</td>
      <td>{staff.gender}</td>
      <td>
        <div className={cx('wrapper-btn')}>
          <div className={cx('btn-edit')} onClick={handleClickUpdateButton}>
            Sửa
          </div>

          <div className={cx('btn-delete')} onClick={handleClickDeleteButton}>
            Xóa
          </div>
        </div>
      </td>
    </tr>
  )
}

export default ItemTable
