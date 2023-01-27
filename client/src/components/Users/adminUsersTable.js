import React, { useEffect, useState, useMemo, useRef, forwardRef } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTable, usePagination, useRowSelect } from 'react-table'
import styled from 'styled-components'
import defaultPicture from '../../pics/defaultProfile.png'
import positionChanger from '../functions/positionChanger';
import { Link } from 'react-router-dom';
import { DeleteUserModal } from '../Modal/DeleteUser'
import activeStatus from '../functions/statusChanger/activeStatus'
import InactiveStatus from '../functions/statusChanger/inactiveStatus'

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
    font-size: 13px;
    font-weight: 400;

    tr {
    width: 100%;
     padding: 0.5rem;
    height: 52px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(0,0,0,.12);
    border-bottom-style: solid;
    display: ${({ isDragging }) => (isDragging ? "table" : "")}
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
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgba(0,0,0,.12);

      :last-child {
        border-right: 0;
        text-align: center
      }
    }
  }
`

const AdminUsersTable = ({ Dataa, Users }) => {

    const token = sessionStorage.getItem('token')
    const [power, setPower] = useState()
    const [data, setData] = useState(Dataa)
    const [edit, setEdit] = useState(false)
    const [Delete, setDelete] = useState(false)
    const [Activate, setactivate] = useState(false)
    const [query, setQuery] = useState("")
    const [showModal, setShowModal] = useState("close")
    const [selectedRows, setSelectedRows] = useState([]);
    const [check, setCheck] = useState(false)
    const userData = useRef([])
    async function getUser() {
        const result = await fetch(`http://localhost:4000/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        }).then(data => data.json())
        setPower(result.data.power)
        setEdit(result.data.edit)
        setDelete(result.data.delete)
        setactivate(result.data.activate)
    }

    useEffect(() => {
        getUser()
    }, [data])

    const activate = (e) => {
        e.preventDefault()
        for (let i = 0; i < selectedFlatRows.length; i++) {
            activeStatus(selectedFlatRows[i].original, setCheck)
        }
    }

    const Deactivate = (e) => {
        e.preventDefault()
        for (let i = 0; i < selectedFlatRows.length; i++) {
            InactiveStatus(selectedFlatRows[i].original, setCheck)
        }
    }

    useEffect(() => {
        if (check) {
            Users().then(() => setCheck(false))
        }
    }, [check])

    const IndeterminateCheckbox = forwardRef(
        ({ indeterminate, data, ...rest }, ref) => {
            const defaultRef = useRef()
            const resolvedRef = ref || defaultRef
            useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate
            }, [resolvedRef, indeterminate])
            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest}
                    />
                </>
            )
        }
    )
    function handleSelection(row) {
        // console.log(row);
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter((selectedRow) => selectedRow !== row));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    }
    // console.log(selectedRows);

    const ImageCell = props => {
        const { column, row, cell, updateMyData } = props;
        const value = cell.value;
        const rowIndex = row.index;
        const columnId = column.id;
        const onChange = (e) => {
            updateMyData(rowIndex, columnId);
        };
        return <div style={{
            textAlign: 'center', display: `${({ isSomethingDragging }) =>
                isSomethingDragging ? "none" : "inline"}`
        }} {...props.dragHandleProps} onChange={onChange}>
            < img src={props.row.original.profile_pic === "Default" ? defaultPicture : props.row.original.profile_pic} alt="" style={{
                width: '40px', height: '40px', borderRadius: '50%',
            }} />
        </div>
    }
    const EditCell = props => {
        const id = props.row.original.id
        return (
            <div style={{ textAlign: 'center' }}>
                {edit && <Link to={"/users/edit?id=" + `${id}`} className="modals" style={{
                    color: "limegreen",
                    paddingLeft: "5px",
                    paddingRight: "10px",
                    fontSize: '17px'
                }}
                >
                    <i className="bx bx-edit" />
                </Link>}
                {Delete && <span onClick={() => {
                    userData.current = props.row.original
                    setShowModal("delete")
                }
                } className="modals" style={{
                    color: "red",
                    paddingLeft: "5px",
                    paddingRight: "10px",
                    fontSize: '17px',
                    cursor: 'pointer'
                }}
                >
                    <i className="nav-icon fas fa-trash" />
                </span>}
            </div>
        )
    }

    const columns = useMemo(() => {

        const DragCell = props => {
            return (
                <ImageCell {...props} />
            );
        };
        const editCell = props => {
            return (
                <EditCell {...props} />
            );
        };
        return [
            {
                Header: '',
                accessor: 'profile_pic',
                Cell: DragCell
            },
            {
                Header: 'First Name',
                accessor: 'first_name'
            },
            {
                Header: 'Last name',
                accessor: 'last_name'
            },
            {
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Address',
                accessor: 'address'
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
            {
                Header: 'Edit',
                show: false,
                isVisible: false,
                Cell: editCell,
            },
        ]
    }, [data])

    const Data = Dataa
    const tableInstance = useTable({ columns, data: Data, initialState: { selectedRowIds: [] } },
        usePagination,
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} data={getToggleAllPageRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} data={row.original} />
                        </div>
                    )
                },
                ...columns
            ]
            )
        }
    )

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
        allColumns,
        selectedFlatRows,
        state: { pageIndex, pageSize, selectedRowIds }
    } = tableInstance

    const reorderData = (startIndex, endIndex) => {
        const newData = [...data];
        const [movedRow] = newData.splice(startIndex, 1);
        newData.splice(endIndex, 0, movedRow);
        const row1 = data[startIndex].id
        const row2 = data[endIndex].id
        if (startIndex !== endIndex) {
            positionChanger(startIndex, endIndex, row1, row2)
            setData(newData);
        }
    };

    const handleDragEnd = result => {
        const { source, destination } = result;
        if (!destination) return;
        reorderData(source.index, destination.index);
    };

    const handleDragStart = result => {
    }

    // const handleCheck = (e) => {

    //     // selectedFlatRows.map(
    //     //     d => d.original
    //     // )
    //     userData.current = selectedFlatRows
    //     console.log(selectedFlatRows);
    //     // if (userData.current.includes(e)) {
    //     //     userData.current = userData.current.filter((selectedRow) => selectedRow !== e);
    //     // } else {
    //     //     userData.current.push(e);
    //     // }

    // }

    return (
        <div>
            <section className="content-wrapper" style={{ padding: '10px' }}>
                {Delete &&
                    <button className="deleteContact"
                        onClick={() => setShowModal("Bulk-delete")}
                    >Delete</button>
                }
                {Activate && <span>
                    <button className="activate"
                        onClick={activate}
                    >Activate</button>
                    <button className="activate" style={{ backgroundColor: "#ccc" }}
                        onClick={Deactivate}
                    >
                        Deactivate</button>
                </span>}
                <input value={query} placeholder="Filter"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }
                    } className="filter" />
                {data ?
                    <Styles>
                        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                            <Droppable droppableId="table-body">

                                {(provided) => (
                                    <table ref={provided.innerRef} {...provided.droppableProps} {...getTableProps()}>
                                        <thead>
                                            {// Loop over the header rows
                                                headerGroups.map(headerGroup => (
                                                    // Apply the header row props
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {// Loop over the headers in each row
                                                            headerGroup.headers.map(column => (
                                                                // Apply the header cell props
                                                                <th {...column.getHeaderProps()}>
                                                                    {// Render the header
                                                                        column.render('Header')}
                                                                </th>
                                                            ))}
                                                    </tr>
                                                ))}
                                        </thead>

                                        <tbody {...getTableBodyProps()}>
                                            {page.map((row, i) => {
                                                prepareRow(row);
                                                return (
                                                    <Draggable
                                                        draggableId={row.original.id.toString()}
                                                        key={row.original.id}
                                                        index={row.index}
                                                    >
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <tr
                                                                    // key={row.original.id}
                                                                    // {...row.getRowProps()}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}
                                                                // isDragging={snapshot.isDragging}
                                                                >
                                                                    {row.cells.map(cell => (
                                                                        <td {...cell.getCellProps()}>
                                                                            {cell.render("Cell", {
                                                                                dragHandleProps: provided.dragHandleProps,
                                                                                isSomethingDragging: snapshot.isDraggingOver
                                                                            })}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            )
                                                        }}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </tbody>

                                    </table>
                                )}
                            </Droppable>
                        </DragDropContext>

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
                                {pageIndex + 1}-{data.length} of {data.length}
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
                <DeleteUserModal showModal={showModal === "delete"} setShowModal={setShowModal} DATA={userData.current}
                    Users={Users} />
                {/* <BulkDelete showModal={showModal === "Bulk-delete"} setShowModal={setShowModal} DATA={userData.current}
                /> */}
            </section>
        </div>

    )
}


export default AdminUsersTable