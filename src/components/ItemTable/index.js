import React, { useState } from 'react'
import classNames from "classnames/bind";
import styles from './ItemTable.module.scss'
import convertDate from '../../utils/convertDate';
import ModalUpdate from '../../pages/ModalUpdate';

const cx = classNames.bind(styles)

function ItemTable({ staff , handleOnclickUpdate, handleOnclickDelete}) {

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
          <div className={cx('btn-edit')} onClick={() => handleOnclickUpdate(staff)}>
            Sửa
          </div>

          <div className={cx('btn-delete')} onClick={() => handleOnclickDelete(staff)}>
            Xóa
          </div>
        </div>
      </td>
    </tr>
  )
}

export default ItemTable
