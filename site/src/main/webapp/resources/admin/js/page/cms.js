(function ($) {
  'use strict';

  // Cached variables
  var treeCache;
  var $selectType;
  var $modalCreateNewPage;
  var $tableFiles;
  var $pageForm;

  function updatePagePosition(pagesToUpdate, parentId) {
    // No need 'encodeURIComponent' because values are numeric
    var data = 'parentId=' + parentId;
    for (var i = 0; i < pagesToUpdate.length; i++) {
      data += '&id=' + pagesToUpdate[i].id;
      data += '&position=' + pagesToUpdate[i].position;
      data += '&level=' + pagesToUpdate[i].level;
    }
  
    $.Cms.ajax({
      url: '/admin/cms/page/updatePosition',
      type: 'POST',
      showSuccessMessage: false,
      errorMessage: 'The page could not be repositioned',
      data: data,
      onError: function () {
        treeCache.reload();
      },
    });
  }
  
  function reloadPage(id) {
    $.Cms.ajax({
      url: '/admin/cms/page/' + id,
      type: 'GET',
      formReset: false,
      showSuccessMessage: false,
      onSuccess: function (data) {
        // remove TinyMce Plugin
        $.Cms.removeAllTinyMce();
        var $tableFiles = $('#tableFiles');
  
        // remove DataTable Plugin and YesNo
        if ($tableFiles) {
          $tableFiles.DataTable().destroy();
          $.Cms.destroyTabSwitchYesNo();
        }
  
        // remove Jquery Upload Plugin
        $('#fileupload').fileupload('destroy');
  
        $pageForm.html(data);
        initFileUpload();
  
        $pageForm.find('[data-toggle="tooltip"]').tooltip();
        $pageForm.find('[data-editor="tinymce"]').each(function (index, element) {
          $.Cms.initTinyMce({ selector: '#' + element.id });
        });
      },
    });
  }
  

  function initFileUpload(params) {
    var defaults = {
      successMessage: 'Files were succesfully uploaded!',
      dropZoneElement: '#dropzone',
      inputFileElement: '#fileupload',
    };
  
    var options = $.extend({}, defaults, params);
    var $fileProgress = $('#file-progress');
    var jqMultiUploadConf = {
      dataType: 'json',
      stop: function (e, data) {
        // $('tr:has(td)').remove();
        $tableFiles.DataTable().ajax.reload();
        $fileProgress.find('.progress-bar').css('width', 0 + '%');
      },
  
      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $fileProgress.find('.progress-bar').css(
          'width',
          progress + '%'
        );
      },
  
      error: function (e, data) {
        $.Cms.notif({
          type: 'error',
          message: this.genericErrorMessage,
        });
      },
  
      // jscs:disable requireDollarBeforejQueryAssignment
      dropZone: $('#dropzone'),
  
      // jscs:enable requireDollarBeforejQueryAssignment
    };
  
    var dragEvent = function (e) {
      var $dropZone = $(options.dropZoneElement);
      var timeout = window.dropZoneTimeout;
      if (!timeout) {
        $dropZone.addClass('in');
      } else {
        clearTimeout(timeout);
      }
  
      var found = false;
      var node = e.target;
      do {
        if (node === $dropZone[0]) {
          found = true;
          break;
        }
  
        node = node.parentNode;
      } while (node !== null);
      if (found) {
        $dropZone.addClass('hover');
      } else {
        $dropZone.removeClass('hover');
      }
  
      window.dropZoneTimeout = setTimeout(function () {
        window.dropZoneTimeout = null;
        $dropZone.removeClass('in hover');
      }, 100);
    };
  
    $(document).bind('dragover', dragEvent);
    $(options.inputFileElement).fileupload(jqMultiUploadConf)
        .bind('fileuploaddone');
  }
  

  function initTree() {
    $('#tree').fancytree({
      extensions: ['filter', 'dnd'],
      source: {
        url: '/admin/cms/tree',
        cache: 'true',
      },
      click: function (event, data) {
  
        if (data.targetType === 'title') {
          var node = data.node;
          reloadPage(node.key);
        }
      },
  
      quicksearch: true,
      filter: {
        autoApply: true, // Re-apply last filter if lazy data is loaded
        counter: true, // Show a badge with number of matching child nodes near parent icons
        fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
        hideExpandedCounter: true, // Hide counter badge, when parent is expanded
        highlight: true, // Highlight matches by wrapping inside <mark> tags
        mode: 'hide', // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
      },
      dnd: {
        autoExpandMS: 400,
        focusOnClick: true,
        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
        preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
        dragStart: function (node, data) {
          return true;
        },
  
        dragEnter: function (node, data) {
          // Prevent dropping a parent below another parent (only sort
          // nodes under the same parent)
          //if(node.parent !== data.otherNode.parent){
          //  return false;
          //}
          return true;
        },
  
        dragDrop: function (node, data) {
          if (data.hitMode === 'over') {
            parentId = node.key;
          } else {
            if (node.parent.getLevel() !== 0) {
              parentId = node.parent.key;
            }
          }
  
          data.otherNode.moveTo(node, data.hitMode);
          var parentId = data.otherNode.parent.getLevel() === 0 ? '' : data.otherNode.parent.key;
  
          //console.log("Son parent est " + parentId);
          //console.log("Tu as bougé le noeud " + data.otherNode.key + ' ' ;
          // + data.hitMode + " le noeud" + node.key);
          //console.log("Parent après " + parentId);
  
          var brother = data.otherNode.parent.getChildren();
          var pagesToUpdate = [];
          for (var i = 0, len = brother.length; i < len; i++) {
            var id = brother[i].key;
            var position = brother[i].getIndex();
            var level = brother[i].getLevel();
            pagesToUpdate[i] = {
              id: id,
              position: position,
              level: level,
            };
          }
  
          updatePagePosition(pagesToUpdate, parentId);
        },
      },
    });
  }
  

  $(function () {
    $.Cms.addCsrfAjaxHeaderToken();

    // init variables
    $pageForm = $('#pageForm');
    initTree();
    treeCache = $('#tree').fancytree('getTree');
    $selectType = $('#selectType');
    $modalCreateNewPage = $('#modalCreateNewPage');

    // Tree event
    $('#searchTree').keyup(function (e) {
      var n;
      var opts = {
        autoExpand: $('#autoExpand').is(':checked'),
        leavesOnly: $('#leavesOnly').is(':checked'),
      };
      var match = $(this).val();
    
      if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === '') {
        $('#btnResetSearch').click();
        return;
      }
    
      // Pass a string to perform case insensitive matching
      n = treeCache.filterNodes(match, opts);
    
      $('#btnResetSearch').attr('disabled', false);
      var result = ' resultat';
      if (n > 1) {
        result += 's';
      }
    
      $('#matches').text(n + result);
    }).focus();
    
    $('#btnResetSearch').click(function (e) {
      $('input[name=search]').val('');
      $('#matches').text('');
      treeCache.clearFilter();
    }).attr('disabled', true);
    

    // Delete a page
    $('#btnDeletePage').click(function () {
      var id = $('#currentPageId').val();
      var params = {
        url: '/admin/cms/page/delete/' + id,
        type: 'DELETE',
        successMessage: 'The page was deleted successfully!',
        onSuccess: function (data) {
          $.Cms.removeAllTinyMce(); // must do before dom is deleted (bug Firefox)
          $pageForm.empty();
          treeCache.reload();
        },
      };
      $.Cms.ajax(params);
    });
    
    // Save a page
    $pageForm.on('click', '#savePageBtn', function () {
      var id = $('#currentPageId').val();
      $.Cms.ajax({
        formJqueryElement: $pageForm,
        successMessage: 'The page was saved successfully!',
        appendToUrl: id,
        formReset: false,
        onSuccess: function () {
          treeCache.reload();
        },
      });
    });
    
    // Create Page
    $('#btnFormCeatePage').click(function () {
      $.Cms.ajax({
        formElement: '#createPageForm',
        successMessage: 'The page was created successfully!',
        onSuccess: function () {
          $modalCreateNewPage.modal('hide');
          treeCache.reload();
        },
      });
    });
    
    // Open Modal Form
    $('#btnCreatePage').click(function () {
      var node = treeCache.getActiveNode();
      var $containerParent = $('#radio-parent-container');
      var $containerRoot = $('#radio-root-container');
      $containerParent.show();
      $containerRoot.show();
      if (node) {
        var title = node.title;
        var parentId = node.key;
        $('#radio-parent').val(parentId).prop('checked', true);
        $containerParent.find('label').html('Child of : ' + title);
      } else {
        $containerParent.hide();
        $('#radio-root').prop('checked', true);
      }
    
      $selectType.val('Page').trigger('change');
      $modalCreateNewPage.modal('show');
    });
    
    $selectType.on('change', function () {
    
      var $selector = $modalCreateNewPage.find('selectHide');
      var anim = 200;
      if (this.value === 'Page') {
        $selector.find('.js-page').show(anim);
        $selector.find('.js-module').hide(anim);
      } else if (this.value === 'Module') {
        $selector.find('.js-page').hide(anim);
        $selector.find('.js-module').show(anim);
      } else {
        $selector.hide(anim);
      }
    });
    

    $pageForm.on('click', '#tabFileBtn', function () {
      var tableFileId = '#tableFiles';
      var id = $pageForm.find('#currentPageId').val();
      $tableFiles = $(tableFileId);
      if (!$.fn.DataTable.isDataTable($tableFiles)) {
        initDataTable(id, $tableFiles);
        initSwitchYesNo(tableFileId);
      }
    });
    
    function initDataTable(id, $tableFiles) {
      $.Cms.initDataTableWithSearch({
        tableJqueryElement: $tableFiles,
        searchElement: '#search-table-files',
        ajax: '/admin/file/getJson/' + id,
        appendOperationColumns: 'double',
        columnDefs: [
          { // name
            aTargets: [0],
            mRender: function (data, type, full) {
              return '<input required type="text" class="light-input" value="' + data + '"/>';
            },
          },
          { // description
            aTargets: [1],
            mRender: function (data, type, full) {
              return '<textarea class="light-input">' + data + '</textarea>';
            },
          },
          { // Active
            aTargets: [2],
            className: 'center',
          },
          { // Type
            aTargets: [3],
            className: 'center',
            mRender: function (data, type, full) {
              return '<img class="imgType" src="/resources/admin/img/files-icons/' +
                      data + '" />';
            },
          },
          { // Size
            aTargets: [4],
            className: 'center',
          },
          { // Operation
            aTargets: [5],
            className: 'center',
          },
        ],
        columns: [
          { data: 'name', },
          { data: 'description', },
          { data: 'active', },
          { data: 'type', },
          { data: 'size', },
        ],
      });
    }
    
    function initSwitchYesNo(tableFileId) {
      $.Cms.initTabSwitchYesNo({
        tableElement: tableFileId,
        onDelete: function ($tr) {
          var id = $tr.data('id');
          $.Cms.ajax({
            url: '/admin/file/delete/' + id,
            type: 'DELETE',
            successMessage: 'File deleted successfully!',
            onSuccess: function () {
              //$tr.hide(200, function () { $tr.remove(); });
              $tableFiles.DataTable().ajax.reload();
            },
          });
        },
    
        onSave: function ($tr) {
          var id = $tr.data('id');
          var $name = $tr.find('input').first();
          var $desc = $tr.find('textarea').first();
          $.Cms.trimAllInputs($tr);
          $name.prop('required', true);
          var validationName = $name.parsley();
          validationName.reset();
          validationName.validate();
          $name.prop('required', false);
          if ($name.val() === '') {
            return;
          }
    
          var data = {
            id: id,
            name: $name.val(),
            description: $desc.val(),
          };
          $.Cms.ajax({
            url: '/admin/file/edit',
            type: 'POST',
            data: data,
            successMessage: 'File edited successfully!',
          });
        },
      });
    }
    
  });
})(jQuery);
