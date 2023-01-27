import React, { useState, useMemo, useEffect } from 'react'
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table'
import styled from 'styled-components'
import Dropdown from 'react-dropdown';
import './admin.css';

const Styles = styled.div`
  padding: 1rem;

  table {    
    position: relative;
    width: 100%;
    border-radius: inherit;
    overflow-x: auto;
    overflow-y: hidden;
    min-height: 0;
    display: table;
        flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 100%;
    color: rgba(0,0,0,0.87);
    background-color: #FFFFFF;
    font-size: 16px;
    font-weight: 400;

    tr {
    width: 100%;
     padding: 0.5rem;
    height: 52px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(0,0,0,.12);
    border-bottom-style: solid;
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      padding-left: 1rem;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgba(0,0,0,.12);

      :last-child {
        // border-right: 0;
        // text-align: -webkit-center
      }
    }
  }
`



const AdminTable = ({ Dataa, token, power }) => {
    const [modal, setModal] = useState("close")
    const [permissionData, setPermissionData] = useState()
    const [editAdmin, setEditAdmin] = useState(false)
    const options = []


    async function getPermissions() {
        const result = await fetch("http://localhost:4000/admins/get-permissions", {
            method: 'POST',
        }).then((req) => req.json())
        if (result.status === 'ok') {
            for (let i = 0; i < result.data.length; i++) {
                options.push(result.data[i].permissionName)
                // setOptions([...options, result.data[i].permissionName])
            }
        }
    }

    async function getPermission() {
        if (power) {
            const result = await fetch("http://localhost:4000/admins/getPermissions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    power
                })
            }).then((req) => req.json())
            if (result.status === 'ok') {
                const dataaa = result.data[0]
                setEditAdmin(dataaa.editAdmin)
            }
        }
    }

    useEffect(() => {
        getPermissions()
    }, [])
    useEffect(() => {
        getPermission()
    }, [power])

    useEffect(() => {
        if (power === "Super Admin") {
            options.pop("Super Admin")
        }
    }, [options])

    const ChangePower = async (e, id) => {
        await fetch('http://localhost:4000/admins/change-power', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                power: e.value,
                id: id
            })
        }).then(data => data.json())
    }

    const SelectCell = props => {
        const { editAdmin } = props
        return <div style={{
            maxWidth: '110px'
        }}>{props.row.original._id !== "63ca4455ffc95b26cf96ba33" ?
            <Dropdown
                options={options}
                // onChange={this._onSelect}
                value={props.row.original.power}
                placeholder="Select"
                onChange={(e) => {
                    ChangePower(e, props.row.original._id)
                    setPermissionData(props.row.original)
                }}
            /> : <div>{props.row.original.power}</div>}
        </div>
    }

    const columns = useMemo(() => {
        const selectCell = props => {
            return (
                <SelectCell {...props} editAdmin={editAdmin ? true : false} />
            )
        }
        return [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Power',
                Cell: selectCell,
            }

        ]
    }, [])


    const Data = Dataa

    const tableInstance = useTable({ columns, data: Data },
        useGlobalFilter, usePagination)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state,
        setGlobalFilter,
        preGlobalFilteredRows,
        state: { pageIndex, pageSize }
    } = tableInstance

    function GlobalFilter({
        globalFilter,
        setGlobalFilter
    }) {
        const [value, setValue] = useState(globalFilter);

        const onChange = value => {
            setValue(value);
            // setGlobalFilter(value)
            onAsyncDebounceChange(value);
        };

        const onAsyncDebounceChange = useAsyncDebounce(value => {
            setGlobalFilter(value);
        }, 1000);

        return (
            <div>
                <input className="filter"
                    value={value}
                    onChange={(e) => {
                        // setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder="Filter "
                />
                <i className="nav-icon fas fa-times" style={{ position: 'relative', right: '30px', cursor: 'pointer' }}
                    onClick={() => setGlobalFilter('')} />
            </div>
        );
    }

    return (
        <div>
            <section className="content-wrapper" style={{ padding: '10px' }}>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                {Dataa ?
                    <Styles>
                        <table {...getTableProps()}>
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {page.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => {
                                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <nav className="pagination">
                            <span>
                                Rows per page:{" "}
                            </span>
                            <div className='selectionDiv'>
                                <select className='paginationSelect'
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                    }}
                                >
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='selectionSVG'>
                                    <path d="M7 10l5 5 5-5z"></path>
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                </svg>
                            </div>
                            <span style={{ margin: '0 24px' }}>
                                {pageIndex + 1}-{Dataa.length} of {Dataa.length}
                            </span>

                            <div className='paginationButtonDiv'>
                                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="paginationButton">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                        <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path>
                                        <path fill="none" d="M24 24H0V0h24v24z"></path>
                                    </svg>
                                </button>{" "}

                                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="paginationButton">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                    </svg>
                                </button>{" "}

                                <button onClick={() => nextPage()} disabled={!canNextPage} className="paginationButton">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                    </svg>
                                </button>{" "}

                                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="paginationButton">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path>
                                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                                    </svg>
                                </button>{" "}
                            </div>
                        </nav>
                    </Styles>
                    : null}
            </section>
        </div>

    )
}


export default AdminTable